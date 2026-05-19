const marketMemory = require("./marketMemory.js");
const BotState = require("../models/BotState.js");

const buildAIContext = async ({
    candles, indicators, ocrData, recentTrades
}) => {
    const botState = await BotState.findOne();
    return {
        market: "SOLUDST",
        timeframe: "5m",
        timestamp: new Date(),
        screenshotAnalysis: ocrData,
        indicators,
        candles: candles.slice(-50),
        marketMemory,
        recentTrades,
        currentStrategy: {
            name: botState?.strategyName || "Default Strategy",
            status: botState?.status || "HOLD"
        }
    };
};

module.exports = buildAIContext;