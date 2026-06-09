const { openLongPosition, closeLongPosition } = require("../services/tradeService");
const { updateMarketData } = require("../marketData/marketDataManager");

/**
 * Executes a manual/test LONG BUY order
 */
async function executeLongBuy({
    userId,
    symbol,
    currentPrice,
    strategy,
    stopLoss,
    targetPrice,
    aiConfidence
}) {
    // Cache the price first so that tradeService can fetch it via getCurrentPrice
    updateMarketData(symbol, currentPrice);
    
    return await openLongPosition({
        userId,
        symbol,
        strategy,
        aiConfidence,
        stopLoss,
        targetPrice
    });
}

/**
 * Executes a manual/test LONG SELL order
 */
async function executeLongSell({
    userId,
    symbol,
    currentPrice
}) {
    // Cache the price first so that tradeService can fetch it via getCurrentPrice
    updateMarketData(symbol, currentPrice);
    
    return await closeLongPosition({
        userId,
        symbol
    });
}

module.exports = {
    executeLongBuy,
    executeLongSell
};
