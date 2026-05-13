// This is our trading execution layer.

// BUY
// Uses 50% balance
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

  const balance = botState.availableBalance;

  if (balance > 10) {

    // Use 50% balance
    const investmentAmount = botState.availableBalance * 0.5;

    // Calculate SOL quantity
    const quantity = investmentAmount / price;

    // Update balances
    botState.availableBalance -= investmentAmount;
    botState.solHolding += quantity;
    botState.totalInvestedAmount = (botState.totalInvestedAmount || 0) + investmentAmount;

    // Update average buy price
    botState.averageBuyPrice = price;

    // Updates the Highest Price till it's Analysis
    botState.highestPrice = price;
    botState.trailingStopPrice = price - ( price * 0.05);

    botState.botMode = "BUYING";
    botState.lastAction = "BUY";
    botState.balanceWarning = false;


    await botState.save();

    // Save trade
    await Trade.create({
      side: "BUY",
      symbol: "SOLUSDT",
      quantity,
      price
    });

    console.log("BUY EXECUTED");
  }
  else {
    console.log("Insufficient Balance!!");

    botState.botMode = "WARNING";
    botState.lastAction = "INSUFFICIENT BALANCE";

    botState.warningMessage = "INSUFFICIENT BALANCE";
    botState.balanceWarning = true;

    await botState.save();
  }
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
  const investedAmount = quantity * botState.averageBuyPrice;

  // Profit
  const profit = sellAmount - investedAmount;

  // Update balance
  botState.availableBalance += sellAmount;

  // Update profit
  botState.totalProfit += profit;

  if (profit < 0) {
    botState.totalLoss = (botState.totalLoss || 0) + Math.abs(profit);
  }

  // Reset holdings
  const sellHolding = botState.solHolding * 0.5;
  botState.solHolding = sellHolding;
  botState.averageBuyPrice = 0;
  botState.highestPrice = 0;
  botState.trailingStopPrice = 0;

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

module.exports = { executeBuy, executeSell };
