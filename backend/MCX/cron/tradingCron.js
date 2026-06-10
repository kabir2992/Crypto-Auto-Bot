const cron          = require("node-cron");
const User          = require("../models/User");
const UserSettings  = require("../models/UserSettings");
const MCXBotState   = require("../models/MCXBotState");

const { getCandles }               = require("../marketData/candleAggregator");
const { calculateIndicators }      = require("../services/indicatorEngine");
const { determineMarketCondition } = require("../services/marketConditionEngine");
const decideTrade                  = require("../bot/strategyEngine");
const {
    openLongPosition,
    closeLongPosition,
    openShortPosition,
    closeShortPosition
} = require("../services/tradeService");

const { getTrackedSymbols, getCandleCount } = require("../marketData/candleAggregator");

// ============================================================
// CONSTANTS
// ============================================================

const MIN_CANDLES    = 200;
const CRON_SCHEDULE  = "*/5 * * * *";   // every 5 minutes

// ============================================================
// HELPERS
// ============================================================

// Gets or creates a BotState for userId + commodity
const getOrCreateBotState = async (userId, commodity) =>
{
    let botState = await MCXBotState.findOne({ userId, commodity });

    if (!botState)
    {
        botState = await MCXBotState.create({
            userId,
            commodity,
            botMode:  "WAITING",
            lastAction: "NONE"
        });
    }

    return botState;
};

// ============================================================
// PER-SYMBOL PROCESSOR
// Runs the full pipeline for one user + one commodity
// ============================================================

const processSymbol = async (user, symbol) =>
{
    console.log(`\n──────────────────────────────────────`);
    console.log(`📊 Processing : ${symbol}`);
    console.log(`👤 User       : ${user.email}`);

    try
    {
        // ── 1. Fetch BotState ─────────────────────────────
        const botState = await getOrCreateBotState(user._id, symbol);

        // ── 2. Fetch Candles ──────────────────────────────
        const candles = getCandles(symbol, MIN_CANDLES);

        console.log(`🕯️  Candles    : ${candles.length} / ${MIN_CANDLES} required`);
        console.log("Tracked symbols count:", getTrackedSymbols().length);
        console.log("GOLDM05JUN26FUT candles:", getCandleCount("GOLDM05JUN26FUT"));
        // console.log( "Total candles in store:", getCandles(symbol, 1000).length );
        // console.log( "Store:", getCandles(symbol, 1000).length, "Returned:", candles.length );

        if (candles.length < MIN_CANDLES)
        {
            console.log(`⚠️  [SKIP] Not enough candles for ${symbol} — waiting for data`);

            // still set next analysis time so UI countdown doesn't stay at 00:00
            botState.nextAnalysisTime = new Date(Date.now() + 5 * 60 * 1000);
            await botState.save();

            return;
        }

        const closes       = candles.map(c => c.close);
        const currentPrice = closes.at(-1);
        const lastPrice    = closes.at(-2);

        // ── 3. Calculate Indicators ───────────────────────
        const indicators = calculateIndicators(candles);

        if (!indicators)
        {
            console.log(`⚠️  [SKIP] Indicators not ready for ${symbol}`);
            return;
        }

        // ── 4. Determine Market Condition ─────────────────
        const marketResult = determineMarketCondition(indicators);

        // ── 5. Update BotState market type ────────────────
        botState.marketType        = marketResult.marketCondition;
        botState.botMode           = "ANALYZING";

        await botState.save();

        console.log("✅ BotState saved, nextAnalysisTime:", botState.nextAnalysisTime);

        // Verify it actually persisted
        const verify = await MCXBotState.findById(botState._id).select("nextAnalysisTime");
        console.log("✅ Verified from DB:", verify.nextAnalysisTime);

        // console.log("🔍 Tracked symbols in candleStore:", getTrackedSymbols());
        console.log("🔍 Requested symbol:", symbol);
        console.log("🔍 Candle count for symbol:", getCandles(symbol).length);

        // ── 6. Log Market Analysis ────────────────────────
        console.log(`\n========== MARKET ANALYSIS [${symbol}] ==========`);
        console.log(`Market        : ${marketResult.marketCondition}`);
        console.log(`Confidence    : ${marketResult.confidence}%`);
        console.log(`Strategy      : ${marketResult.strategyUsed}`);
        console.log(`Scores        : BULLISH=${marketResult.scores.BULLISH} | BEARISH=${marketResult.scores.BEARISH} | SIDEWAYS=${marketResult.scores.SIDEWAYS} | VOLATILE=${marketResult.scores.VOLATILE}`);
        console.log(`Reasons       :`);
        marketResult.reasons.forEach(r => console.log(`   • ${r}`));
        console.log(`================================================`);

        // ── 7. Log Indicator Data ─────────────────────────
        console.log(`\n========== BOT DATA [${symbol}] ==========`);
        console.log(`Current Price : ₹${currentPrice}`);
        console.log(`Last Price    : ₹${lastPrice}`);
        console.log(`RSI           : ${indicators.rsi?.toFixed(2)}`);
        console.log(`EMA 20        : ${indicators.ema20?.toFixed(2)}`);
        console.log(`EMA 50        : ${indicators.ema50?.toFixed(2)}`);
        console.log(`EMA 200       : ${indicators.ema200?.toFixed(2)}`);
        console.log(`MACD          : ${indicators.latestMACD?.toFixed(4)}`);
        console.log(`MACD Signal   : ${indicators.latestSignal?.toFixed(4)}`);
        console.log(`MACD Histogram: ${indicators.latestHistogram?.toFixed(4)}`);
        console.log(`ADX           : ${indicators.adx?.toFixed(2)}`);
        console.log(`ATR           : ${indicators.atr?.toFixed(2)}`);
        console.log(`BB Upper      : ${indicators.bbUpper?.toFixed(2)}`);
        console.log(`BB Lower      : ${indicators.bbLower?.toFixed(2)}`);
        console.log(`BB Width      : ${(indicators.bbWidth * 100)?.toFixed(3)}%`);
        console.log(`VWAP          : ${indicators.vwap?.toFixed(2)}`);
        console.log(`Trend         : ${indicators.trend?.toFixed(4)}%`);
        console.log(`Volatility    : ${indicators.volatility?.toFixed(4)}%`);
        console.log(`Momentum      : ${indicators.momentum?.toFixed(4)}`);
        console.log(`Volume Ratio  : ${indicators.volumeRatio?.toFixed(2)}x`);
        console.log(`Support       : ₹${indicators.supportLevel}`);
        console.log(`Resistance    : ₹${indicators.resistanceLevel}`);
        console.log(`Breakout      : ${indicators.breakout}`);
        console.log(`Breakdown     : ${indicators.breakdown}`);
        console.log(`ATR Long SL   : ₹${indicators.longSL?.toFixed(2)}`);
        console.log(`ATR Long TP   : ₹${indicators.longTP?.toFixed(2)}`);
        console.log(`ATR Short SL  : ₹${indicators.shortSL?.toFixed(2)}`);
        console.log(`ATR Short TP  : ₹${indicators.shortTP?.toFixed(2)}`);
        console.log(`Bot Mode      : ${botState.botMode}`);
        console.log(`Last Action   : ${botState.lastAction}`);
        console.log(`Balance       : ₹${botState.availableBalance?.toFixed(2)}`);
        console.log(`Next Analysis : ${botState.nextAnalysisTime?.toLocaleTimeString()}`);
        console.log(`==========================================`);

        // ── 8. Run Strategy Engine ────────────────────────
        const strategyResult = await decideTrade({
            // identity
            userId:     user._id,
            symbol,
            botState,

            // market
            marketCondition: marketResult.marketCondition,

            // indicators (flat — passed directly)
            ...indicators,

            // convenience aliases matching Binance strategy signatures
            currentPrice,
            lastPrice
        });

        const action = strategyResult.action;

        // ── 9. Log Strategy Decision ──────────────────────
        console.log(`\n========== STRATEGY DECISION [${symbol}] ==========`);
        console.log(`Market        : ${marketResult.marketCondition}`);
        console.log(`Strategy Used : ${strategyResult.strategyName}`);
        console.log(`Final Action  : ${action}`);
        console.log(`======================================================`);

        // ── 10. Execute Trade ─────────────────────────────

        if (action === "HOLD")
        {
            botState.botMode   = "HOLDING";
            botState.lastAction = "HOLD";
            await botState.save();

            console.log(`🟡 [HOLD] ${symbol} — no trade executed`);
            return;
        }

        if (action === "LONG_BUY")
        {
            await openLongPosition({
                userId:      user._id,
                symbol,
                strategy:    strategyResult.strategyName,
                aiConfidence:0,
                stopLoss:    indicators.longSL,
                targetPrice: indicators.longTP
            });
        }

        else if (action === "LONG_SELL")
        {
            await closeLongPosition({
                userId: user._id,
                symbol
            });
        }

        else if (action === "SHORT_SELL")
        {
            await openShortPosition({
                userId:      user._id,
                symbol,
                strategy:    strategyResult.strategyName,
                aiConfidence:0,
                stopLoss:    indicators.shortSL,
                targetPrice: indicators.shortTP
            });
        }

        else if (action === "SHORT_CLOSE")
        {
            await closeShortPosition({
                userId: user._id,
                symbol
            });
        }

    }
    catch (err)
    {
        console.log(`❌ [ERROR] ${symbol} for ${user.email}: ${err.message}`);
    }
};

// ============================================================
// CRON STARTER
// ============================================================

const startTradingCron = () =>
{
    global.nextAnalysisTime = new Date(Date.now() + 5 * 60 * 1000).getTime();
    
    cron.schedule(CRON_SCHEDULE, async () =>
    {
        global.nextAnalysisTime = new Date(Date.now() + 5 * 60 * 1000).getTime();
        const now = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });

        console.log("\n================================");
        console.log("🚀 MCX CRON TRIGGERED @", now);
        console.log("================================");

        try
        {
            // All users with botEnabled + isActive
            const users = await User.find({
                botEnabled: true,
                isActive:   true
            });

            console.log(`👥 Active Users : ${users.length}`);

            if (!users.length)
            {
                console.log("ℹ️  No active users with bot enabled.");
                return;
            }

            for (const user of users)
            {
                const settings = await UserSettings.findOne({ userId: user._id });

                const symbols = settings?.selectedCommodities || [];

                console.log(`\n👤 ${user.email} → Commodities: [${symbols.join(", ")}]`);

                if (!symbols.length)
                {
                    console.log(`   ⚠️  No commodities selected for ${user.email}`);
                    continue;
                }

                for (const symbol of symbols)
                {
                    await processSymbol(user, symbol);
                }
            }

            console.log("\n✅ MCX CRON CYCLE COMPLETE");
            console.log("================================\n");
        }
        catch (err)
        {
            console.log("❌ MCX CRON GLOBAL ERROR:", err.message);
        }
    });

    console.log("✅ MCX Trading Cron Started (every 5 minutes)");
};

module.exports = { startTradingCron };