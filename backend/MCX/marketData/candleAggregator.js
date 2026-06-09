const MCXCandle = require("../models/MCXCandle");

// ============================================================
// CANDLE STORE  (in-memory, fast working copy)
// ============================================================

const candleStore = {};

// ============================================================
// HELPERS
// ============================================================

function createNewCandle(price, volume, timestamp)
{
    return {
        open:      price,
        high:      price,
        low:       price,
        close:     price,
        volume:    volume || 0,
        startTime: timestamp || Date.now()
    };
}

// Save completed candle to MongoDB (non-blocking)
async function persistCandle(symbol, candle)
{
    try
    {
        await MCXCandle.updateOne(
            {
                symbol,
                timestamp: candle.startTime
            },
            {
                $set: {
                    symbol,
                    timestamp: candle.startTime,
                    open:      candle.open,
                    high:      candle.high,
                    low:       candle.low,
                    close:     candle.close,
                    volume:    candle.volume
                }
            },
            { upsert: true }
        );
    }
    catch (err)
    {
        // Don't crash the price feed on DB errors
        console.log(`⚠️  [CANDLE PERSIST] ${symbol}: ${err.message}`);
    }
}

// ============================================================
// ADD TICK
// Called every second from livePrice.js websocket
// ============================================================

function addTick(symbol, price, volume = 0, timestamp)
{
    if (!symbol || !price) return;

    if (!candleStore[symbol])
    {
        candleStore[symbol] = [];
    }

    const candles     = candleStore[symbol];
    const currentTime = timestamp || Date.now();

    let currentCandle = candles[candles.length - 1];

    // ── First candle ──────────────────────────────────────
    if (!currentCandle)
    {
        candles.push(createNewCandle(price, volume, currentTime));
        return;
    }

    // ── New 5-min window → close current, open new ────────
    if (currentTime - currentCandle.startTime >= 5 * 60 * 1000)
    {
        // Persist completed candle to MongoDB
        persistCandle(symbol, currentCandle);

        // Keep max 500 candles in memory
        if (candles.length >= 500)
        {
            candles.shift();
        }

        candles.push(createNewCandle(price, volume, currentTime));
        return;
    }

    // ── Update current candle ─────────────────────────────
    currentCandle.high  = Math.max(currentCandle.high, price);
    currentCandle.low   = Math.min(currentCandle.low,  price);
    currentCandle.close = price;
    currentCandle.volume += volume;
}

// ============================================================
// GET CANDLES
// Returns last N candles for a symbol from memory
// ============================================================

function getCandles(symbol, limit = 200)
{
    const candles = candleStore[symbol] || [];
    return candles.slice(-limit);
}

// ============================================================
// LOAD FROM DB
// Called at startup — loads persisted candles into memory
// so in-memory store is warm before cron fires
// ============================================================

async function loadCandlesFromDB(symbol, limit = 200)
{
    try
    {
        const dbCandles = await MCXCandle
            .find({ symbol })
            .sort({ timestamp: 1 })
            .limit(limit)
            .lean();

        if (!dbCandles || dbCandles.length === 0) return 0;

        if (!candleStore[symbol])
        {
            candleStore[symbol] = [];
        }

        for (const c of dbCandles)
        {
            candleStore[symbol].push({
                open:      c.open,
                high:      c.high,
                low:       c.low,
                close:     c.close,
                volume:    c.volume,
                startTime: c.timestamp
            });
        }

        return dbCandles.length;
    }
    catch (err)
    {
        console.log(`⚠️  [LOAD FROM DB] ${symbol}: ${err.message}`);
        return 0;
    }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getLastCandle(symbol)
{
    const candles = candleStore[symbol] || [];
    return candles.at(-1) || null;
}

function getTrackedSymbols()
{
    return Object.keys(candleStore);
}

function getCandleCount(symbol)
{
    return (candleStore[symbol] || []).length;
}

module.exports = {
    addTick,
    getCandles,
    loadCandlesFromDB,
    getLastCandle,
    getTrackedSymbols,
    getCandleCount
};