const MCXPosition     = require("../models/MCXPosition");
const MCXTrade        = require("../models/MCXTrade");
const MCXBotState     = require("../models/MCXBotState");
const commodityConfig = require("../config/commodityConfig");
const extractCommodity  = require("../utils/extractCommoditiy");
const { generateTradeId } = require("../utils/tradeIDGenerator");
const { getCurrentPrice } = require("../marketData/marketDataManager");

// ============================================================
// HELPERS
// ============================================================

const getOpenLongPosition = async (userId, symbol) =>
    MCXPosition.findOne({ userId, symbol, side: "LONG",  status: "OPEN" });

const getOpenShortPosition = async (userId, symbol) =>
    MCXPosition.findOne({ userId, symbol, side: "SHORT", status: "OPEN" });

// ============================================================
// LOT CALCULATOR
// Risk riskPercent% of available balance, min 1 lot
// ============================================================

const calculateLots = (availableBalance, config) =>
{
    const riskAmount = availableBalance * (config.riskPercent / 100);
    return Math.max(1, Math.floor(riskAmount / config.marginPerLot));
};

// ============================================================
// GET CONFIG HELPER
// symbol = full symbol (SILVERMIC30JUN26FUT)
// baseSymbol = extracted (SILVERMIC) → used for config lookup only
// ============================================================

const getConfig = (symbol) =>
{
    const base = extractCommodity(symbol);
    const config = commodityConfig[base];

    return { config, base };
};

// ============================================================
// LONG BUY
// ============================================================

const openLongPosition = async ({
    userId,
    symbol,
    strategy,
    aiConfidence = 0,
    stopLoss,
    targetPrice
}) => {

    try
    {
        const { config } = getConfig(symbol);

        if (!config)
        {
            console.log(`❌ [LONG BUY] No commodity config for ${symbol}`);
            return { success: false, message: "Commodity config missing" };
        }

        const existing = await getOpenLongPosition(userId, symbol);

        if (existing)
        {
            console.log(`⚠️  [LONG BUY] Long already open for ${symbol}`);
            return { success: false, message: "Long position already open" };
        }

        const botState = await MCXBotState.findOne({ userId, commodity: symbol });

        if (!botState)
        {
            console.log(`❌ [LONG BUY] BotState not found for ${symbol}`);
            return { success: false, message: "BotState not found" };
        }

        const currentPrice = getCurrentPrice(symbol);

        if (!currentPrice)
        {
            console.log(`❌ [LONG BUY] No live price for ${symbol}`);
            return { success: false, message: "No live price available" };
        }

        const lots           = calculateLots(botState.availableBalance, config);
        const marginRequired = lots * config.marginPerLot;

        if (botState.availableBalance < marginRequired)
        {
            console.log(`❌ [LONG BUY] Insufficient balance for ${symbol} — need ₹${marginRequired}, have ₹${botState.availableBalance.toFixed(2)}`);
            return { success: false, message: "Insufficient balance" };
        }

        const tradeId = generateTradeId(symbol);

        await MCXTrade.create({
            userId,
            symbol,
            tradeId,
            side:         "LONG_BUY",
            positionSide: "LONG",
            lots,
            quantity:     lots * config.lotSize,
            price:        currentPrice,
            entryPrice:   currentPrice,
            stopLoss,
            targetPrice,
            strategy,
            aiConfidence,
            status:       "OPEN"
        });

        await MCXPosition.create({
            userId,
            symbol,
            tradeId,
            side:       "LONG",
            status:     "OPEN",
            lots,
            quantity:   lots * config.lotSize,
            entryPrice: currentPrice,
            stopLoss,
            targetPrice,
            strategy
        });

        botState.availableBalance    -= marginRequired;
        botState.totalInvestedAmount += marginRequired;
        botState.lastBuyPrice         = currentPrice;
        botState.lastAction           = "LONG BUY";
        botState.botMode              = "LONG BUYING";
        botState.currentStrategy      = strategy;

        await botState.save();

        console.log("✅ [LONG BUY] EXECUTED");
        console.log("   Symbol     :", symbol);
        console.log("   Price      : ₹" + currentPrice);
        console.log("   Lots       :", lots);
        console.log("   Margin     : ₹" + marginRequired);
        console.log("   Stop Loss  : ₹" + (stopLoss    ? stopLoss.toFixed(2)    : "N/A"));
        console.log("   Target     : ₹" + (targetPrice ? targetPrice.toFixed(2) : "N/A"));
        console.log("   Balance    : ₹" + botState.availableBalance.toFixed(2));

        return { success: true, tradeId, lots, currentPrice };
    }
    catch (err)
    {
        console.log(`❌ [LONG BUY ERROR] ${symbol}:`, err.message);
        return { success: false, error: err.message };
    }
};

// ============================================================
// LONG SELL
// ============================================================

const closeLongPosition = async ({ userId, symbol }) =>
{
    try
    {
        const { config } = getConfig(symbol);

        if (!config)
        {
            console.log(`❌ [LONG SELL] No commodity config for ${symbol}`);
            return { success: false, message: "Commodity config missing" };
        }

        const position = await getOpenLongPosition(userId, symbol);

        if (!position)
        {
            console.log(`⚠️  [LONG SELL] No open long position for ${symbol}`);
            return { success: false, message: "No open long position" };
        }

        const botState = await MCXBotState.findOne({ userId, commodity: symbol });

        if (!botState)
        {
            console.log(`❌ [LONG SELL] BotState not found for ${symbol}`);
            return { success: false, message: "BotState not found" };
        }

        const currentPrice = getCurrentPrice(symbol);

        if (!currentPrice)
        {
            console.log(`❌ [LONG SELL] No live price for ${symbol}`);
            return { success: false, message: "No live price available" };
        }

        const profit =
            (currentPrice - position.entryPrice) *
            config.pointValue *
            position.lots;

        const marginReleased = position.lots * config.marginPerLot;

        position.status    = "CLOSED";
        position.exitPrice = currentPrice;
        position.profit    = profit;
        position.closedAt  = new Date();

        await position.save();

        await MCXTrade.create({
            userId,
            symbol,
            tradeId:      generateTradeId(symbol),
            side:         "LONG_SELL",
            positionSide: "LONG",
            lots:         position.lots,
            quantity:     position.quantity,
            price:        currentPrice,
            entryPrice:   position.entryPrice,
            exitPrice:    currentPrice,
            profit,
            strategy:     position.strategy,
            status:       "CLOSED",
            closedAt:     new Date()
        });

        botState.availableBalance += marginReleased + profit;
        botState.totalSellAmount  += marginReleased;

        if (profit > 0) botState.totalProfit += profit;
        else            botState.totalLoss   += Math.abs(profit);

        botState.realTotalProfit = botState.totalProfit - botState.totalLoss;
        botState.lastAction      = "LONG SELL";
        botState.botMode         = "LONG SELLING";

        await botState.save();

        console.log("✅ [LONG SELL] EXECUTED");
        console.log("   Symbol     :", symbol);
        console.log("   Entry      : ₹" + position.entryPrice);
        console.log("   Exit       : ₹" + currentPrice);
        console.log("   P&L        : ₹" + profit.toFixed(2), profit >= 0 ? "🟢" : "🔴");
        console.log("   Balance    : ₹" + botState.availableBalance.toFixed(2));

        return { success: true, profit, currentPrice };
    }
    catch (err)
    {
        console.log(`❌ [LONG SELL ERROR] ${symbol}:`, err.message);
        return { success: false, error: err.message };
    }
};

// ============================================================
// SHORT SELL
// ============================================================

const openShortPosition = async ({
    userId,
    symbol,
    strategy,
    aiConfidence = 0,
    stopLoss,
    targetPrice
}) => {

    try
    {
        const { config } = getConfig(symbol);

        if (!config)
        {
            console.log(`❌ [SHORT SELL] No commodity config for ${symbol}`);
            return { success: false, message: "Commodity config missing" };
        }

        const existing = await getOpenShortPosition(userId, symbol);

        if (existing)
        {
            console.log(`⚠️  [SHORT SELL] Short already open for ${symbol}`);
            return { success: false, message: "Short position already open" };
        }

        const botState = await MCXBotState.findOne({ userId, commodity: symbol });

        if (!botState)
        {
            console.log(`❌ [SHORT SELL] BotState not found for ${symbol}`);
            return { success: false, message: "BotState not found" };
        }

        const currentPrice = getCurrentPrice(symbol);

        if (!currentPrice)
        {
            console.log(`❌ [SHORT SELL] No live price for ${symbol}`);
            return { success: false, message: "No live price available" };
        }

        const lots           = calculateLots(botState.availableBalance, config);
        const marginRequired = lots * config.marginPerLot;

        if (botState.availableBalance < marginRequired)
        {
            console.log(`❌ [SHORT SELL] Insufficient balance for ${symbol}`);
            return { success: false, message: "Insufficient balance" };
        }

        const tradeId = generateTradeId(symbol);

        await MCXTrade.create({
            userId,
            symbol,
            tradeId,
            side:         "SHORT_SELL",
            positionSide: "SHORT",
            lots,
            quantity:     lots * config.lotSize,
            price:        currentPrice,
            entryPrice:   currentPrice,
            stopLoss,
            targetPrice,
            strategy,
            aiConfidence,
            status:       "OPEN"
        });

        await MCXPosition.create({
            userId,
            symbol,
            tradeId,
            side:       "SHORT",
            status:     "OPEN",
            lots,
            quantity:   lots * config.lotSize,
            entryPrice: currentPrice,
            stopLoss,
            targetPrice,
            strategy
        });

        botState.availableBalance    -= marginRequired;
        botState.totalInvestedAmount += marginRequired;
        botState.lastAction           = "SHORT SELL";
        botState.botMode              = "SHORT SELLING";
        botState.currentStrategy      = strategy;

        await botState.save();

        console.log("✅ [SHORT SELL] EXECUTED");
        console.log("   Symbol     :", symbol);
        console.log("   Price      : ₹" + currentPrice);
        console.log("   Lots       :", lots);
        console.log("   Margin     : ₹" + marginRequired);
        console.log("   Stop Loss  : ₹" + (stopLoss    ? stopLoss.toFixed(2)    : "N/A"));
        console.log("   Target     : ₹" + (targetPrice ? targetPrice.toFixed(2) : "N/A"));
        console.log("   Balance    : ₹" + botState.availableBalance.toFixed(2));

        return { success: true, tradeId, lots, currentPrice };
    }
    catch (err)
    {
        console.log(`❌ [SHORT SELL ERROR] ${symbol}:`, err.message);
        return { success: false, error: err.message };
    }
};

// ============================================================
// SHORT CLOSE
// ============================================================

const closeShortPosition = async ({ userId, symbol }) =>
{
    try
    {
        const { config } = getConfig(symbol);

        if (!config)
        {
            console.log(`❌ [SHORT CLOSE] No commodity config for ${symbol}`);
            return { success: false, message: "Commodity config missing" };
        }

        const position = await getOpenShortPosition(userId, symbol);

        if (!position)
        {
            console.log(`⚠️  [SHORT CLOSE] No open short position for ${symbol}`);
            return { success: false, message: "No open short position" };
        }

        const botState = await MCXBotState.findOne({ userId, commodity: symbol });

        if (!botState)
        {
            console.log(`❌ [SHORT CLOSE] BotState not found for ${symbol}`);
            return { success: false, message: "BotState not found" };
        }

        const currentPrice = getCurrentPrice(symbol);

        if (!currentPrice)
        {
            console.log(`❌ [SHORT CLOSE] No live price for ${symbol}`);
            return { success: false, message: "No live price available" };
        }

        const profit =
            (position.entryPrice - currentPrice) *
            config.pointValue *
            position.lots;

        const marginReleased = position.lots * config.marginPerLot;

        position.status    = "CLOSED";
        position.exitPrice = currentPrice;
        position.profit    = profit;
        position.closedAt  = new Date();

        await position.save();

        await MCXTrade.create({
            userId,
            symbol,
            tradeId:      generateTradeId(symbol),
            side:         "SHORT_CLOSE",
            positionSide: "SHORT",
            lots:         position.lots,
            quantity:     position.quantity,
            price:        currentPrice,
            entryPrice:   position.entryPrice,
            exitPrice:    currentPrice,
            profit,
            strategy:     position.strategy,
            status:       "CLOSED",
            closedAt:     new Date()
        });

        botState.availableBalance += marginReleased + profit;

        if (profit > 0) botState.totalProfit += profit;
        else            botState.totalLoss   += Math.abs(profit);

        botState.realTotalProfit = botState.totalProfit - botState.totalLoss;
        botState.lastAction      = "SHORT CLOSE";
        botState.botMode         = "SHORT CLOSING";

        await botState.save();

        console.log("✅ [SHORT CLOSE] EXECUTED");
        console.log("   Symbol     :", symbol);
        console.log("   Entry      : ₹" + position.entryPrice);
        console.log("   Exit       : ₹" + currentPrice);
        console.log("   P&L        : ₹" + profit.toFixed(2), profit >= 0 ? "🟢" : "🔴");
        console.log("   Balance    : ₹" + botState.availableBalance.toFixed(2));

        return { success: true, profit, currentPrice };
    }
    catch (err)
    {
        console.log(`❌ [SHORT CLOSE ERROR] ${symbol}:`, err.message);
        return { success: false, error: err.message };
    }
};

module.exports = {
    openLongPosition,
    closeLongPosition,
    openShortPosition,
    closeShortPosition
};