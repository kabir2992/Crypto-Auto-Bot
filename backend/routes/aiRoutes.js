const express = require("express");
const Groq = require("groq-sdk");
const buildAIContext = require("../services/aiContextBuilder");
const aiDecisionService = require("../services/aiDecisionService");

const router = express.Router();


router.post('/analyze', async (req, res) => {
    try {
        const { candles, indicators, ocrData, recentTrades } = req.body;

        const context = await buildAIContext({ candles, indicators, ocrData, recentTrades });

        const aiDecision = await aiDecisionService(context);

        res.status(200).json({
            success: true,
            ai: aiDecision
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error in AI Routes",
            error: err.message
        });
    }
});

module.exports = router;