const express = require("express");

const buildAIContext = require("../services/aiContextBuilder");

const aiDecisionService = require("../services/aiDecisionService");

const Trade = require("../models/Trade");

const router = express.Router();

router.get("/analyze", async (req, res) => {

    try {
        const recentTrades = await Trade .find() .sort({ createdAt: -1 }) .limit(20);

        // You already have chart service somewhere
        // SAME DATA YOU SEND TO FRONTEND /chart

        const candles = global.chartData || [];

        const indicators = {

            rsi:
              candles?.slice(-1)[0]?.rsi,

            ema:
              candles?.slice(-1)[0]?.ema,

            macd:
              candles?.slice(-1)[0]?.macd,

            volume:
              candles?.slice(-1)[0]?.volume

        };

        const ocrData = {};

        const context = await buildAIContext({ candles, indicators, ocrData, recentTrades });

        const aiDecision = await aiDecisionService(context);

        return res.status(200).json({
            success: true,
            ai: aiDecision
        });

    }
    catch (err)
    {

        console.log(
          "AI Route Error:",
          err.message
        );

        return res.status(500).json({
            success: false,
            message: "Error in AI Routes",
            error: err.message
        });

    }

});

module.exports = router;