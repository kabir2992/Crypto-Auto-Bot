// This is our trading execution layer.

// BUY
// Uses 50% balance
// Calculates SOL quantity
// Updates holdings
// Saves trade
// SELL
// Sells half of current SOL holding
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

    const previousHolding = botState.solHolding;
    const previousInvestedAmount = previousHolding * botState.averageBuyPrice;
    const newInvestedAmount = previousInvestedAmount + investmentAmount;
    const newHolding = previousHolding + quantity;

    // Update balances
    botState.availableBalance -= investmentAmount;
    botState.solHolding = newHolding;
    botState.totalInvestedAmount = (botState.totalInvestedAmount || 0) + investmentAmount;

    // Update average buy price and latest entry price
    botState.averageBuyPrice = newInvestedAmount / newHolding;
    botState.lastBuyPrice = price;
    botState.minimumSellPrice = botState.averageBuyPrice + 1;

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
  if (profit > 0)
  {
    botState.totalProfit += profit;
  }

  if (profit < 0) 
  {
    botState.totalLoss = (botState.totalLoss || 0) + Math.abs(profit);
  }

  // The Real Profit after subtracting Total Loss
  botState.realTotalProfit = botState.totalProfit - botState.totalLoss;

  // Update remaining holdings
  botState.solHolding -= quantity;

  if (botState.solHolding <= 0) {
    botState.solHolding = 0;
    botState.averageBuyPrice = 0;
    botState.lastBuyPrice = 0;
    botState.minimumSellPrice = 0;
    botState.highestPrice = 0;
    botState.trailingStopPrice = 0;
  }
  else {
    botState.highestPrice = price;
    botState.trailingStopPrice = price - (price * 0.05);
    botState.minimumSellPrice = botState.averageBuyPrice + 1;
  }

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
