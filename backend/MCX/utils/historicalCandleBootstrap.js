const { SmartAPI }          = require("smartapi-javascript");
const speakeasy             = require("speakeasy");
const axios                 = require("axios");
const { addTick, loadCandlesFromDB, getCandleCount } = require("../marketData/candleAggregator");
const MCXCandle             = require("../models/MCXCandle");

// ============================================================
// HELPERS
// ============================================================

function getMCXEnv()
{
    return {
        apiKey:     process.env.MCX_API_KEY,
        clientId:   process.env.MCX_CLIENT_ID,
        password:   process.env.MCX_PASSWORD,
        totpSecret: process.env.MCX_TOTP_SECRET || process.env.MCX_SECRET_KEY
    };
}

function formatDate(date)
{
    const pad = n => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ============================================================
// STEP 1 — LOAD FROM MONGODB
// Returns how many symbols already have 200+ candles in DB
// ============================================================

async function loadFromDB(mcxFutures)
{
    console.log("📂 Loading candles from MongoDB...");

    let loaded  = 0;
    let missing = [];

    for (const item of mcxFutures)
    {
        const symbol = item.symbol;
        const count  = await loadCandlesFromDB(symbol, 200);

        if (count >= 200)
        {
            loaded++;
        }
        else
        {
            // Not enough in DB — need to fetch from Angel One
            missing.push({ item, existing: count });
        }
    }

    console.log(`   ✅ Loaded from DB : ${loaded} contracts (200+ candles)`);
    console.log(`   ⚠️  Need fetch     : ${missing.length} contracts`);

    return missing;
}

// ============================================================
// STEP 2 — FETCH FROM ANGEL ONE (only missing contracts)
// ============================================================

async function fetchFromAngelOne(missing, jwtToken, apiKey, fromStr, toStr)
{
    if (missing.length === 0)
    {
        console.log("✅ All contracts loaded from DB — skipping Angel One");
        return;
    }

    console.log(`\n📡 Fetching ${missing.length} contracts from Angel One...`);

    let seeded  = 0;
    let skipped = 0;
    let failed  = 0;

    for (const { item } of missing)
    {
        const fullSymbol = item.symbol;
        const token      = String(item.token).trim();

        let retries = 0;
        let done    = false;

        while (!done && retries <= 5)
        {
            try
            {
                const response = await axios.post(
                    "https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData",
                    {
                        exchange:    "MCX",
                        symboltoken: token,
                        interval:    "FIVE_MINUTE",
                        fromdate:    fromStr,
                        todate:      toStr
                    },
                    {
                        headers: {
                            Authorization:     `Bearer ${jwtToken}`,
                            "X-ClientLocalIP": "127.0.0.1",
                            "X-ClientPublicIP":"127.0.0.1",
                            "X-MACAddress":    "00:00:00:00:00:00",
                            "X-PrivateKey":    apiKey,
                            "X-SourceID":      "WEB",
                            "Content-Type":    "application/json",
                            Accept:            "application/json"
                        }
                    }
                );

                const candles = response?.data?.data;

                if (!candles || candles.length === 0)
                {
                    skipped++;
                    done = true;
                    break;
                }

                const slice = candles.slice(-200);

                // Bulk save to MongoDB
                const docs = [];

                for (const candle of slice)
                {
                    const [timestamp, open, high, low, close, volume] = candle;
                    if (!close || !timestamp) continue;

                    const ts = new Date(timestamp).getTime();

                    // Add to in-memory store
                    addTick(fullSymbol, open,  volume / 4, ts);
                    addTick(fullSymbol, high,  volume / 4, ts + 1);
                    addTick(fullSymbol, low,   volume / 4, ts + 2);
                    addTick(fullSymbol, close, volume / 4, ts + 3);

                    // Prepare for DB bulk write
                    docs.push({
                        updateOne: {
                            filter: { symbol: fullSymbol, timestamp: ts },
                            update: {
                                $set: {
                                    symbol: fullSymbol, open, high, low, close,
                                    volume: volume || 0,
                                    timestamp: ts
                                }
                            },
                            upsert: true
                        }
                    });
                }

                // Bulk write to MongoDB
                if (docs.length > 0)
                {
                    await MCXCandle.bulkWrite(docs, { ordered: false });
                }

                seeded++;
                done = true;

                if (seeded % 10 === 0)
                {
                    console.log(`   ⏳ Fetched ${seeded} / ${missing.length}...`);
                    await sleep(2000);
                }
                else
                {
                    await sleep(1200);
                }
            }
            catch (err)
            {
                const status  = err?.response?.status;
                const message = err?.response?.data?.message || err.message;

                if (status === 403 || status === 429)
                {
                    retries++;
                    const wait = retries * 5000;
                    console.log(`   ⚠️  Rate limited — retry ${retries}/5 in ${wait/1000}s...`);
                    await sleep(wait);
                    continue;
                }

                if (status === 401)
                {
                    console.log("❌ Auth expired — stopping Angel One fetch");
                    return;
                }

                if (failed === 0)
                {
                    console.log(`   ⚠️  First failure [${fullSymbol}] ${status}: ${message}`);
                }

                failed++;
                done = true;
            }
        }

        if (!done) failed++;
    }

    console.log(`\n   Fetched : ${seeded}`);
    console.log(`   Skipped : ${skipped} (no data)`);
    console.log(`   Failed  : ${failed} (errors)`);
}

// ============================================================
// MAIN BOOTSTRAP
// ============================================================

async function bootstrapCandles()
{
    const { apiKey, clientId, password, totpSecret } = getMCXEnv();

    console.log("\n📚 Starting candle bootstrap...");

    // ── Fetch instrument master ───────────────────────────
    const instruments = await axios.get(
        "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
    );

    const mcxFutures = instruments.data.filter(
        i => i.exch_seg === "MCX" && i.instrumenttype === "FUTCOM"
    );

    console.log(`📦 Found ${mcxFutures.length} MCX futures contracts`);

    // ── Step 1: Load from MongoDB ─────────────────────────
    const missing = await loadFromDB(mcxFutures);

    // ── Step 2: Fetch missing from Angel One ──────────────
    if (missing.length > 0)
    {
        if (!apiKey || !clientId || !password || !totpSecret)
        {
            console.log("⚠️  Angel One credentials missing — skipping fetch");
            console.log(`   ${missing.length} contracts will build from live ticks`);
        }
        else
        {
            // Login to Angel One
            const api  = new SmartAPI({ api_key: apiKey });
            const totp = speakeasy.totp({ secret: totpSecret, encoding: "base32" });
            const session = await api.generateSession(clientId, password, totp);

            if (!session?.data?.jwtToken)
            {
                console.log("❌ Angel One login failed:", session?.message);
                console.log(`   ${missing.length} contracts will build from live ticks`);
            }
            else
            {
                console.log("✅ Angel One login successful");

                const toDate   = new Date();
                const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                await fetchFromAngelOne(
                    missing,
                    session.data.jwtToken,
                    apiKey,
                    formatDate(fromDate),
                    formatDate(toDate)
                );
            }
        }
    }

    // ── Final summary ─────────────────────────────────────
    const ready = mcxFutures.filter(
        i => getCandleCount(i.symbol) >= 200
    ).length;

    console.log(`\n✅ Bootstrap complete`);
    console.log(`   Ready (200+ candles) : ${ready} contracts`);
    console.log(`   Still building       : ${mcxFutures.length - ready} contracts\n`);
}

module.exports = { bootstrapCandles };