const marketMemory = require("./marketMemory.js");
const BotState = require("../models/BotState.js");

const buildAIContext = async ({ candles, indicators, ocrData, recentTrades }) => {
const botState = await BotState.findOne();

return {
    market: "SOLUSDT",
    timeframe: "5m",
    timestamp: new Date(),
    screenshotAnalysis: ocrData,
    indicators: {
        rsi: indicators?.rsi,
        emaFast: indicators?.emaFast,
        emaSlow: indicators?.emaSlow,
        macd: indicators?.macd,
        signal: indicators?.signal,
        volumeTrend: indicators?.volumeTrend
    },
    candles: candles
        .slice(-15)
        .map(c => ({
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume
        })),
    marketMemory: marketMemory || [],
    recentTrades: recentTrades || [],
    currentStrategy: {
        name: botState?.strategyName || "Default Strategy",
        status: botState?.status || "HOLD"
    }
};
};

module.exports = buildAIContext;