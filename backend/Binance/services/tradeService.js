const Trade = require("../models/Trade");
const BotState = require("../models/BotState");
const Position = require("../models/Position");

// =====================================
// LONG BUY
// =====================================

const executeBuy = async (price) => {

  const botState = await BotState.findOne();

  const hasOpenShorts = await Position.exists({
    side: "SHORT",
    status: "OPEN"
  });

  if (hasOpenShorts) {
    console.log("Cannot LONG BUY while SHORT positions are open");
    return;
  }

  const balance = botState.availableBalance;

  if (balance < 10) {

    console.log("Insufficient Balance");

    botState.botMode = "WARNING";
    botState.lastAction = "INSUFFICIENT BALANCE";
    botState.warningMessage = "INSUFFICIENT BALANCE";
    botState.balanceWarning = true;

    await botState.save();

    return;
  }

  // Use 50% balance
  const investmentAmount = balance * 0.5;

  // Quantity
  const quantity = investmentAmount / price;

  // Existing holdings
  const previousHolding = botState.solHolding;
  const previousInvestedAmount = previousHolding * botState.averageBuyPrice;

  // New totals
  const newInvestedAmount = previousInvestedAmount + investmentAmount;
  const newHolding = previousHolding + quantity;

  // Update balances
  botState.availableBalance -= investmentAmount;

  // Total LONG quantity
  botState.solHolding = newHolding;

  // Portfolio totals
  botState.totalBuyAmount = (botState.totalBuyAmount || 0) + investmentAmount;

  // Average price
  botState.averageBuyPrice = newInvestedAmount / newHolding;

  botState.lastBuyPrice = price;

  botState.minimumSellPrice = botState.averageBuyPrice + 0.6;

  // Trailing SL
  botState.highestPrice = price;

  // Total Invested Amount
  botState.totalInvestedAmount = (botState.totalInvestedAmount || 0) + investmentAmount;

  botState.trailingStopPrice = price * 0.95;

  botState.botMode = "LONG BUYING";

  botState.lastAction = "LONG BUY";

  await botState.save();

  // Save Position
  await Position.create({
    side: "LONG",
    status: "OPEN",
    quantity,
    entryPrice: price,
    stopLoss: price * 0.99,
    takeProfit: price * 1.05,
    strategy: botState.currentStrategy
  });

  // Save Trade
  await Trade.create({
    side: "BUY",
    symbol: "SOLUSDT",
    quantity,
    price
  });

  console.log("LONG BUY EXECUTED");
};

// =====================================
// LONG SELL
// =====================================

const executeSell = async (price) => {

  const botState = await BotState.findOne();

  const openPositions = await Position.find({
    side: "LONG",
    status: "OPEN"
  });

  if (!openPositions.length) {

    console.log("No LONG positions");

    return;
  }

  // ONLY profitable positions
  const profitablePositions = openPositions.filter(position => {

    const profitPercent = ((price - position.entryPrice) / position.entryPrice) * 100;

    return profitPercent >= 0.5;

  });

  if (!profitablePositions.length) {

    console.log("No profitable LONG positions");

    return;
  }

  let totalSellAmount = 0;
  let totalProfit = 0;
  let totalQuantitySold = 0;

  for (const position of profitablePositions) {

    const sellAmount = position.quantity * price;

    const investedAmount = position.quantity * position.entryPrice;

    const profit = sellAmount - investedAmount;

    // Close position
    position.status = "CLOSED";

    position.exitPrice = price;

    position.profit = profit;

    position.closedAt = new Date();

    await position.save();

    // Totals
    totalSellAmount += sellAmount;

    totalProfit += profit;

    totalQuantitySold += position.quantity;

    // Save trade
    await Trade.create({
      side: "SELL",
      symbol: "SOLUSDT",
      quantity: position.quantity,
      price,
      profit
    });
  }

  // Update balances
  botState.availableBalance += totalSellAmount;
  
  // Investment Update
  botState.totalInvestedAmount += botState.availableBalance;

  // Update Total Sell Amount
  botState.totalSellAmount = (botState.totalSellAmount || 0) + totalSellAmount;

  // Reduce ONLY sold quantity
  botState.solHolding -= totalQuantitySold;

  if (botState.solHolding < 0) {
    botState.solHolding = 0;
  }

  // Profit tracking
  if (totalProfit > 0) {
    botState.totalProfit += totalProfit;
  }

  if (totalProfit < 0) {
    botState.totalLoss += Math.abs(totalProfit);
  }

  botState.realTotalProfit = botState.totalProfit - botState.totalLoss;

  // Reset averages if no more LONG positions
  const remainingLongs = await Position.countDocuments({
    side: "LONG",
    status: "OPEN"
  });

  if (remainingLongs === 0) {

    botState.averageBuyPrice = 0;
    botState.lastBuyPrice = 0;
    botState.minimumSellPrice = 0;
    botState.highestPrice = 0;
    botState.trailingStopPrice = 0;
  }

  botState.botMode = "LONG SELLING";

  botState.lastAction = "LONG SELL";

  await botState.save();

  console.log("LONG SELL EXECUTED");
};

// =====================================
// SHORT SELL
// =====================================

const executeShortSell = async (price) => {

  const botState = await BotState.findOne();

  // const hasOpenLongs = await Position.exists({
  //   side: "LONG",
  //   status: "OPEN"
  // });

  // if (hasOpenLongs) {

  //   console.log("Cannot SHORT while LONG positions are open");

  //   return;
  // }

  const hasOpenShorts = await Position.exists({
    side: "SHORT",
    status: "OPEN"
  });

  if (hasOpenShorts) {
    console.log("Cannot SHORT while SHORT position is open");
    return;
  }

  const balance = botState.availableBalance;

  if (balance <= 10) {

    console.log("Insufficient Balance for SHORT");

    return;
  }

  // Use 30% margin
  const margin = balance * 0.3;

  const quantity = margin / price;

  // Lock margin
  botState.availableBalance -= margin;

  botState.botMode = "SHORT SELLING";

  botState.lastAction = "SHORT SELL";

  await botState.save();

  // Create SHORT position
  await Position.create({
    side: "SHORT",
    status: "OPEN",
    quantity,
    entryPrice: price,
    stopLoss: price * 1.03,
    takeProfit: price * 0.95,
    strategy: botState.currentStrategy,
    margin
  });

  // Save Trade
  await Trade.create({
    side: "SHORT",
    symbol: "SOLUSDT",
    quantity,
    price
  });

  console.log("SHORT SELL EXECUTED");
};

// =====================================
// SHORT CLOSE
// =====================================

const closeShortPositions = async (price) => {

  const botState = await BotState.findOne();

  const shortPositions = await Position.find({
    side: "SHORT",
    status: "OPEN"
  });

  if (!shortPositions.length) {

    console.log("No SHORT positions");

    return;
  }

  // ONLY profitable shorts
  const profitableShorts = shortPositions.filter(position => {

    const profitPercent = ((position.entryPrice - price) / position.entryPrice) * 100;

    return profitPercent >= 0.5;

  });

  if (!profitableShorts.length) {

    console.log("No profitable SHORT positions");

    return;
  }

  let totalProfit = 0;
  let releasedMargin = 0;

  for (const position of profitableShorts) {

    // SHORT profit
    const profit =
      (position.entryPrice - price) * position.quantity;

    position.status = "CLOSED";

    position.exitPrice = price;

    position.profit = profit;

    position.closedAt = new Date();

    await position.save();

    totalProfit += profit;

    releasedMargin += position.margin;

    // Save Trade
    await Trade.create({
      side: "SHORT CLOSE",
      symbol: "SOLUSDT",
      quantity: position.quantity,
      price,
      profit
    });
  }

  // Return margin
  botState.availableBalance += releasedMargin;

  // Add profits
  botState.availableBalance += totalProfit;

  // Profit tracking
  if (totalProfit > 0) {
    botState.totalProfit += totalProfit;
  }

  if (totalProfit < 0) {
    botState.totalLoss += Math.abs(totalProfit);
  }

  botState.realTotalProfit = botState.totalProfit - botState.totalLoss;

  botState.botMode = "SHORT CLOSING";

  botState.lastAction = "SHORT CLOSE";

  await botState.save();

  console.log("SHORT POSITIONS CLOSED");
};

module.exports = { executeBuy, executeSell, executeShortSell, closeShortPositions };