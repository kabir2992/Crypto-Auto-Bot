const Groq = require("groq-sdk");
const AIStrategyLog = require("../models/AIStrategyLog");

const aiDecisionService = async (context) => {
    try {
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

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
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

        await AIStrategyLog.create({
            coin: "SOLUSDT",
            decision: parsed.decision,
            strategyName: parsed.strategy,
            confidence: parsed.confidence,
            reason: parsed.reason,
            entryPrice: parsed.recommenedEntry,
            currentPrice: context?.candles?.slice(-1)[0]?.close,
            stopLoss: parsed.recommenedStopLoss,
            takeProfit: parsed.recommenedTakeProfit,
            marketTrend: parsed.marketTrend,
            summary: parsed.summary
        });
        return parsed;
    }
    catch(err)
    {
        console.log("Error in AI Decesion Service: ", err.message);

        return {
            decision: "HOLD",
            confidence: 0,
            strategy: "Protection Fallback",
            riskLevel: "HIGH",
            reason: ["AI Failed to Analyze Market"],
            marketTrend: "UNKNOWN",
            summary: "Fallback HOLD Triggered"
        };
    }
}

module.exports = aiDecisionService;