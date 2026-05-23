const Groq = require("groq-sdk");
const AIStrategyLog = require("../models/AIStrategyLog");

const aiDecisionService = async (context) => {
  try {
    const prompt = `You are an advanced AI crypto trading analyst.

Analyze the provided SOLUSDT market context carefully.
Generate a unique professional strategy name based on your reasoning and market analysis.

Your responsibilities:
- analyze candle momentum
- analyze RSI
- analyze EMA trend
- analyze MACD
- analyze volume
- analyze recent trades
- detect market strength and weakness
- avoid risky trades during uncertainty

You must decide one: BUY, SELL, or HOLD

CRITICAL RULES:
- Return ONLY a raw JSON object
- No markdown, no backticks, no explanation outside JSON
- Start your response with { and end with }
- Confidence must be between 0-100
- Use realistic stop loss and take profit
- Base everything ONLY on provided context

JSON Structure:
{
  "decision": "",
  "confidence": 0,
  "strategy": "",
  "aiStrategyName": "",
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
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const response = result.choices[0].message.content;

    // ✅ More aggressive cleaning — extract JSON even if Groq adds extra text
    let cleaned = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find the first { and last } to extract pure JSON
    const firstBrace = cleaned.indexOf("{");
    const lastBrace  = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON found in Groq response");
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    // ✅ Fixed typos: recommened → recommended
    await AIStrategyLog.create({
      coin:          "SOLUSDT",
      decision:      parsed.decision,
      strategyName:  parsed.strategy,
      aiStrategyName:parsed.aiStrategyName,
      confidence:    parsed.confidence,
      reason:        parsed.reason,
      entryPrice:    parsed.recommendedEntry,      // ✅ fixed
      currentPrice:  context?.candles?.slice(-1)[0]?.close,
      stopLoss:      parsed.recommendedStopLoss,   // ✅ fixed
      takeProfit:    parsed.recommendedTakeProfit,
      marketTrend:   parsed.marketTrend,
      summary:       parsed.summary,
    });

    console.log("AI Decision:", parsed);
    return parsed;

  } catch (err) {
    console.log("Error in AI Decision Service:", err.message);
    return {
      decision:    "HOLD",
      confidence:  0,
      strategy:    "Protection Fallback",
      riskLevel:   "HIGH",
      reason:      ["AI Failed to Analyze Market"],
      marketTrend: "UNKNOWN",
      summary:     "Fallback HOLD Triggered",
    };
  }
};

module.exports = aiDecisionService;