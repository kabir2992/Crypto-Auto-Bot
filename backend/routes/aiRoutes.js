const express = require("express");
const Groq = require("groq-sdk");
const buildAIContext = require("../services/aiContextBuilder");

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/analyze', async (req, res) => {
    try {
        const { candles, indicators, ocrData, recentTrades } = req.body;

        const context = await buildAIContext({ candles, indicators, ocrData, recentTrades });

        const prompt = `You are an advanced AI crypto trading analyst.

                        Analyze the provided SOLUSDT market context carefully.

                        Your responsibilities:
                        - analyze candle momentum
                        - analyze RSI
                        - analyze EMA trend
                        - analyze MACD
                        - analyze volume
                        - analyze recent trades
                        - analyze screenshot-detected strategy
                        - detect market strength and weakness
                        - avoid risky trades during uncertainty

                        You must decide one:
                        BUY
                        SELL
                        HOLD

                        IMPORTANT RULES:
                        - Return ONLY valid JSON
                        - No markdown
                        - No explanation outside JSON
                        - Confidence must be between 0-100
                        - Use realistic stop loss and take profit
                        - Base everything ONLY on provided context
                        - Do not hallucinate indicators

                        JSON Structure:

                        {
                        "decision": "",
                        "confidence": 0,
                        "strategy": "",
                        "riskLevel": "",
                        "reason": [],
                        "recommendedEntry": 0,
                        "recommendedStopLoss": 0,
                        "recommendedTakeProfit": 0,
                        "marketTrend": "",
                        "summary": ""
                        }

                        MARKET CONTEXT: ${JSON.stringify(context)}`;

        const result = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
        });

        const response = result.choices[0].message.content;
        let cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
        const parsed = JSON.parse(cleaned);

        res.status(200).json({
            success: true,
            ai: parsed
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