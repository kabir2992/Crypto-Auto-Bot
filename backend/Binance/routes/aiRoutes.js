const express = require("express");
const router  = express.Router();

const client             = require("../services/binanceService");
const { calculateRSI, calculateEMA, calculateMACD } = require("../services/indicatorService");
const buildAIContext     = require("../services/aiContextBuilder");
const aiDecisionService  = require("../services/aiDecisionService");
const Trade              = require("../models/Trade");

router.get("/analyze", async (req, res) => {
  try {
    // ── 1. Fetch recent trades from DB ──────────────────────────────────────
    const recentTrades = await Trade.find().sort({ createdAt: -1 }).limit(20);

    // ── 2. Fetch live candles from Binance ──────────────────────────────────
    const rawCandles = await client.klines("SOLUSDT", "1m", { limit: 60 });

    const candles = rawCandles.data.map(c => ({
      originalTime: c[0],
      open:         parseFloat(c[1]),
      high:         parseFloat(c[2]),
      low:          parseFloat(c[3]),
      close:        parseFloat(c[4]),
      volume:       parseFloat(c[5]),
    }));

    // ── 3. Calculate indicators same way chartController does ───────────────
    const closes  = candles.map(c => c.close);
    const volumes = candles.map(c => c.volume);

    const rsiValues  = calculateRSI(closes);
    const ema20Values = calculateEMA(closes, 20);
    const ema50Values = calculateEMA(closes, 50);
    const macdData   = calculateMACD(closes);

    const latestRSI  = rsiValues[rsiValues.length - 1]   || 0;
    const latestEMA20 = ema20Values[ema20Values.length - 1] || 0;
    const latestEMA50 = ema50Values[ema50Values.length - 1] || 0;
    const latestVolume = volumes[volumes.length - 1]      || 0;

    const indicators = {
      rsi:    latestRSI,
      ema20:  latestEMA20,
      ema50:  latestEMA50,
      macd:   macdData.macd,
      signal: macdData.signal,
      histogram: macdData.histogram,
      volume: latestVolume,
    };

    // ── 4. Build context and get AI decision ────────────────────────────────
    const context    = await buildAIContext({ candles, indicators, ocrData: {}, recentTrades });
    const aiDecision = await aiDecisionService(context);

    console.log("AI Decision: ", aiDecision);

    return res.status(200).json({ success: true, ai: aiDecision });

  } catch (err) {
    console.log("AI Route Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error in AI Routes",
      error:   err.message
    });
  }
});

module.exports = router;