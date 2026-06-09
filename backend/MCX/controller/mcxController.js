const marketCache =
require("../marketData/marketCache");

const {
    executeLongBuy,
    executeLongSell
}
= require("../bot/tradeManager");

const {
    getCandles
}
= require("../marketData/candleAggregator");

const {
    calculateIndicators
}
= require("../services/indicatorEngine");

const {
    determineMarketCondition
}
= require("../services/marketConditionEngine");

const decideTrade =
require("../bot/strategyEngine");

exports.getLivePrice =
async (req,res) =>
{
    const symbol =
    req.params.symbol;

    const livePrice =
    marketCache[symbol];

    if (!livePrice)
    {
        return res.status(404).json({
            message: `No live price found for ${symbol}`
        });
    }

    return res.json(livePrice);
};

exports.getCandles =
async (req,res) =>
{
    const candles =
    await getCandles(
        req.params.symbol
    );

    res.json(candles);
};

exports.testIndicators =
async (req,res) =>
{
    const candles =
    await getCandles(
        req.params.symbol
    );

    const indicators =
    calculateIndicators(candles);

    if (!indicators)
    {
        return res.status(400).json({
            message: "Not enough candles to calculate indicators"
        });
    }

    res.json(indicators);
};

exports.testMarketCondition =
async (req,res) =>
{
    const candles =
    await getCandles(
        req.params.symbol
    );

    const indicators =
    calculateIndicators(candles);

    if (!indicators)
    {
        return res.status(400).json({
            message: "Not enough candles to calculate market condition"
        });
    }

    const result =
    determineMarketCondition(indicators);

    res.json(result);
};

exports.testStrategy =
async (req,res) =>
{
    const candles =
    await getCandles(
        req.params.symbol
    );

    const indicators =
    calculateIndicators(candles);

    if (!indicators)
    {
        return res.status(400).json({
            message: "Not enough candles to calculate strategy"
        });
    }

    const market =
    determineMarketCondition(indicators);

    const MCXBotState = require("../models/MCXBotState");
    let botState = await MCXBotState.findOne({ userId: req.body.userId, commodity: req.params.symbol });
    if (!botState) {
        botState = new MCXBotState({ userId: req.body.userId, commodity: req.params.symbol, botMode: "WAITING", lastAction: "NONE" });
    }

    const closes       = candles.map(c => c.close);
    const currentPrice = closes.at(-1);
    const lastPrice    = closes.at(-2);

    const result =
    await decideTrade({
        symbol: req.params.symbol,
        userId: req.body.userId,
        botState,
        marketCondition: market.marketCondition,
        ...indicators,
        currentPrice,
        lastPrice
    });

    res.json(result);
};

exports.testBuy =
async (req,res) =>
{
    const symbol =
    req.params.symbol;

    const currentPrice =
    req.body.currentPrice ||
    marketCache[symbol]?.price;

    if (!currentPrice)
    {
        return res.status(400).json({
            message: "currentPrice is required when no live price is cached"
        });
    }

    await executeLongBuy({
        userId:
        req.body.userId,

        symbol:
        symbol,

        currentPrice:
        currentPrice,

        strategy:
        req.body.strategy || "Manual Test",

        stopLoss:
        req.body.stopLoss,

        targetPrice:
        req.body.targetPrice,

        aiConfidence:
        req.body.aiConfidence
    });

    res.json({
        success: true,
        message: "Long buy request processed"
    });
};

exports.testSell =
async (req,res) =>
{
    const symbol =
    req.params.symbol;

    const currentPrice =
    req.body.currentPrice ||
    marketCache[symbol]?.price;

    if (!currentPrice)
    {
        return res.status(400).json({
            message: "currentPrice is required when no live price is cached"
        });
    }

    await executeLongSell({
        userId:
        req.body.userId,

        symbol:
        symbol,

        currentPrice:
        currentPrice
    });

    res.json({
        success: true,
        message: "Long sell request processed"
    });
};
