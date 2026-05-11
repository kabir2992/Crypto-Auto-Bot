const cron = require("node-cron");
const analyzeMarket = require("../services/analysisService");
const client = require("../services/binanceService");
const decideTrade = require("../bot/strategyEngine");
const { calculateRSI } = require("../services/indicatorService");
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
      console.log( "BotState not found" );
      return;
    }

    // ======================
    // UPDATE BOT MODE
    // ======================

    botState.botMode = "ANALYZING";

    // ======================
    // NEXT ANALYSIS TIME
    // ======================

    const nextMinute = new Date( Date.now() + 60 * 1000 );

    botState.nextAnalysisTime = nextMinute;

    await botState.save();

    console.log( "Next Analysis At:", nextMinute.toLocaleTimeString() );

    // ======================
    // FETCH MARKET CANDLES
    // ======================

    const candles = await client.klines( "SOLUSDT", "1h",
        {
          limit: 50
        }
      );

    // ======================
    // EXTRACT CLOSE PRICES
    // ======================

    const closes = candles.data.map( candle => parseFloat(candle[4]) );

    const currentPrice = closes[closes.length - 1];

    const lastPrice =  closes[closes.length - 2];

    // ======================
    // RSI CALCULATION
    // ======================

    const rsiValues = calculateRSI(closes);

    const latestRSI = rsiValues[ rsiValues.length - 1 ];

    // ======================
    // MARKET ANALYSIS
    // ======================

    const analysis = analyzeMarket();

    if (!analysis) {
      console.log( "Not enough market data yet..." );
      return;
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
        currentPrice,
        lastPrice,
        botState
      });

    // ======================
    // LOGS
    // ======================

    console.log( "========== BOT DATA ==========" );
    console.log( "RSI:", latestRSI.toFixed(2) );
    console.log( "Current Price:", currentPrice );
    console.log( "Last Price:", lastPrice );
    console.log( "Trend:", analysis.trend.toFixed(2) );
    console.log( "Volatility:", analysis.volatility.toFixed(2) );
    console.log( "Momentum:", analysis.momentum.toFixed(2) );
    console.log( "Support:", analysis.supportLevel );
    console.log( "Resistance:", analysis.resistanceLevel );
    console.log( "SOL Holding:", botState.solHolding );
    console.log( "Action:",action);
    console.log( "================================" );

    // ======================
    // EXECUTE BUY
    // ======================

    if (action === "BUY") {
      botState.botMode = "BUYING";
      await botState.save();
      await executeBuy( currentPrice );
    }

    // ======================
    // EXECUTE SELL
    // ======================

    if (action === "SELL") {
      botState.botMode = "SELLING";
      await botState.save();
      await executeSell( currentPrice );
    }

    // ======================
    // HOLD MODE
    // ======================

    if (action === "HOLD") {

      botState.botMode = "HOLDING";
      await botState.save();
    }

  } catch (error) {
    console.log( "Cron Error:", error.message );
  }

});