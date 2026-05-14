const cron = require("node-cron");
const analyzeMarket = require("../services/analysisService");
const client = require("../services/binanceService");
const decideTrade = require("../bot/strategyEngine");
const { calculateRSI, calculateEMA, calculateMACD } = require("../services/indicatorService");
const { executeBuy, executeSell } = require("../services/tradeService");
const BotState = require("../models/BotState");

// cron.schedule("0 * * * *", async () => {

cron.schedule("*/1 * * * *", async () => {

  console.log(
    "Running Trading Bot..."
  );

  try {
    const botState = await BotState.findOne();

    if (!botState) {
      console.log("BotState not found");
      return;
    }

    if (botState.availableBalance > 10 && botState.balanceWarning) {
      botState.balanceWarning = false;
      botState.warningMessage = "";
    }

    // ======================
    // UPDATE BOT MODE
    // ======================

    botState.botMode = "ANALYZING";

    // ======================
    // NEXT ANALYSIS TIME
    // ======================

    const nextMinute = new Date(Date.now() + 60 * 1000);

    botState.nextAnalysisTime = nextMinute;

    await botState.save();

    console.log("Next Analysis At:", nextMinute.toLocaleTimeString());

    // ======================
    // FETCH MARKET CANDLES
    // ======================

    const candles = await client.klines("SOLUSDT", "1m",
      {
        limit: 50
      }
    );

    // ======================
    // EXTRACT CLOSE PRICES
    // ======================

    const closes = candles.data.map(candle => parseFloat(candle[4]));

    const currentPrice = closes[closes.length - 1];

    const lastPrice = closes[closes.length - 2];

    // ======================
    // RSI CALCULATION
    // ======================

    const rsiValues = calculateRSI(closes);

    const latestRSI = rsiValues[rsiValues.length - 1];


    // ======================
    // EMA CALCULATION:- Exponentional Moving Average, calculates average market price for short and long term
    // ======================

    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);

    const latestEMA20 = ema20[ema20.length - 1];
    const latestEMA50 = ema50[ema50.length - 1];

    // ======================
    // MACD CALCULATION:- Moving Average Convergence Divergence, compares short-term momentum and logn-term momentum
    // ======================

    const macdData = calculateMACD(closes);

    const latestMACD = macdData.macd;
    const latestSignal = macdData.signal;
    const latestHistogram = macdData.histogram;

    // ======================
    // MARKET ANALYSIS
    // ======================

    const analysis = analyzeMarket();

    if (!analysis) {
      console.log("Not enough market data yet...");
      return;
    }

    // ======================
    // TSLS DECISION:- Trailing Stop Loss System
    // ======================

    if ( botState.solHolding > 0)
    {
      if ( currentPrice > botState.highestPrice )
      {
        botState.highestPrice = currentPrice;

        botState.trailingStopPrice = currentPrice - ( currentPrice * 0.05 );
        await botState.save();

        console.log("Tariling Stop Updated:", botState.trailingStopPrice);
      }
    }
    // ======================
    // STRATEGY DECISION
    // ======================

    const action = decideTrade({
      rsi: latestRSI,
      trend: analysis.trend,
      volatility: analysis.volatility,
      momentum: analysis.momentum,
      supportLevel: analysis.supportLevel,
      resistanceLevel: analysis.resistanceLevel,
      latestEMA20,
      latestEMA50,
      latestMACD,
      latestSignal,
      currentPrice,
      lastPrice,
      botState
    });

    // ======================
    // LOGS
    // ======================

    console.log("========== BOT DATA ==========");
    console.log("RSI:", latestRSI.toFixed(2));
    console.log("Current Price:", currentPrice);
    console.log("Last Price:", lastPrice);
    console.log("Trend:", analysis.trend.toFixed(2));
    console.log("Volatility:", analysis.volatility.toFixed(2));
    console.log("Momentum:", analysis.momentum.toFixed(2));
    console.log("Support:", analysis.supportLevel);
    console.log("Resistance:", analysis.resistanceLevel);
    console.log("Latest EMA 20:", latestEMA20);
    console.log("Latest EMA 50:", latestEMA50);
    console.log("Latest MACD:", latestMACD);
    console.log("Latest MACD Signal:", latestSignal);
    console.log("Latest MACD Histogram:", latestHistogram);
    console.log("Bot State Highest Price:", botState.highestPrice);
    console.log("Bot State Trailing Stop Price:", botState.trailingStopPrice);
    console.log("SOL Holding:", botState.solHolding);
    console.log("Action:", action);
    console.log("================================");

    // ======================
    // EXECUTE BUY
    // ======================

    if (action === "BUY") {
      botState.botMode = "BUYING";
      await botState.save();
      await executeBuy(currentPrice);
    }

    // ======================
    // EXECUTE SELL
    // ======================

    if (action === "SELL") {
      botState.botMode = "SELLING";
      await botState.save();
      await executeSell(currentPrice);
    }

    // ======================
    // HOLD MODE
    // ======================

    if (action === "HOLD") {
      botState.botMode = "HOLDING";
      botState.lastAction = "HOLD";
      await botState.save();
    }

  } catch (error) {
    console.log("Cron Error:", error.message);
  }

});
