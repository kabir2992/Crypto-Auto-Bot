// This is our trading execution layer.

// BUY
// Uses 10% balance
// Calculates SOL quantity
// Updates holdings
// Saves trade
// SELL
// Sells all SOL
// Calculates profit
// Updates balances
// Saves trade

const Trade = require("../models/Trade");
const BotState = require("../models/BotState");

const executeBuy = async (price) => {

  const botState = await BotState.findOne();

  // Use 50% balance
  const investmentAmount =
    botState.availableBalance * 0.5;

  // Calculate SOL quantity
  const quantity = investmentAmount / price;

  // Update balances
  botState.availableBalance -= investmentAmount;
  botState.solHolding += quantity;

  // Update average buy price
  botState.averageBuyPrice = price;

  botState.botMode = "BUYING";
  botState.lastAction = "BUY";
  

  await botState.save();

  // Save trade
  await Trade.create({
    side: "BUY",
    symbol: "SOLUSDT",
    quantity,
    price
  });

  console.log("BUY EXECUTED");
};

const executeSell = async (price) => {

  const botState = await BotState.findOne();

  if (botState.solHolding <= 0) {
    return;
  }

  const quantity = botState.solHolding;

  // Total sell value
  const sellAmount = quantity * price;

  // Original investment
  const investedAmount =
    quantity * botState.averageBuyPrice;

  // Profit
  const profit =
    sellAmount - investedAmount;

  // Update balance
  botState.availableBalance += sellAmount;

  // Update profit
  botState.totalProfit += profit;

  // Reset holdings
  botState.solHolding = 0;
  botState.averageBuyPrice = 0;

  botState.botMode = "SELLING";
  botState.lastAction = "SELL";

  await botState.save();

  // Save trade
  await Trade.create({
    side: "SELL",
    symbol: "SOLUSDT",
    quantity,
    price,
    profit
  });

  console.log("SELL EXECUTED");
};

module.exports = { executeBuy, executeSell};