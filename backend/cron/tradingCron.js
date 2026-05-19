const cron = require("node-cron");
const analyzeMarket = require("../services/analysisService");
const client = require("../services/binanceService");
const decideTrade = require("../bot/strategyEngine");
const { calculateRSI, calculateEMA, calculateMACD } = require("../services/indicatorService");
const { executeBuy, executeSell } = require("../services/tradeService");
const BotState = require("../models/BotState");
const Trade = require("../models/Trade");
const { analyzeMarketCondition } = require("../services/marketMemory");
const aiDecisionService = require("../services/aiDecisionService");
const buildAIContext = require("../services/aiContextBuilder");
const decisionFusionService = require("../services/decisionFusionService");

// cron.schedule("0 * * * *", async () => {

cron.schedule("*/5 * * * *", async () => {

  console.log( "Running Trading Bot..." );

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

    const nextMinute = new Date(Date.now() + 5 * 60 * 1000);

    botState.nextAnalysisTime = nextMinute;

    await botState.save();

    console.log("Next Analysis At:", nextMinute.toLocaleTimeString());

    // ======================
    // FETCH MARKET CANDLES
    // ======================

    const candles = await client.klines("SOLUSDT", "5m",
      {
        limit: 100
      }
    );

    const indicators = await client.klines("SOLUSDT", "5m",
      {
        limit: 100
      }
    );

    // ======================
    // EXTRACT CLOSE PRICES
    // ======================

    const closes = candles.data.map(candle => parseFloat(candle[4]));

    const closesi = indicators.data.map(candle => parseFloat(candle[4]));

    const recentTrades = await Trade.findOne().sort({ createdAt: -1}).limit(10);

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

    const analysisM = analyzeMarket();

    if (!analysisM) {
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

    const analysis = analyzeMarketCondition({
      rsi: latestRSI,
      trend: analysisM.trend,
      volatility: analysisM.volatility,
      momentum: analysisM.momentum,
      supportLevel: analysisM.supportLevel,
      resistanceLevel: analysisM.resistanceLevel,
      ema20: latestEMA20,
      ema50: latestEMA50,
      macd: latestMACD,
      latestSignal,
      currentPrice,
      lastPrice,
      botState
    });

    const action = decideTrade({
      marketType: analysis.marketType,
      rsi: latestRSI,
      trend: analysisM.trend,
      volatility: analysisM.volatility,
      momentum: analysisM.momentum,
      supportLevel: analysisM.supportLevel,
      resistanceLevel: analysisM.resistanceLevel,
      latestEMA20,
      latestEMA50,
      latestMACD,
      latestSignal,
      currentPrice,
      lastPrice,
      botState
    });

    // const action = strategyResult.action;

    const context = await buildAIContext({
      candles : closes,
      indicators : closesi,
      ocrData: {},
      recentTrades : recentTrades
    });

    const aiDecision = await aiDecisionService(context);
    console.log("AI Decision: ", aiDecision);

    const fusionResult = decisionFusionService({
      aiDecision,
      strategyDecision: action.leadingDecision,
      strategyVotes: {
        BUY: action.votes?.BUY,
        SELL: action.votes?.SELL,
        HOLD: action.votes?.HOLD
      }
    });

    console.log("========== AI Fusion Result ==========");
    console.log("AI Decision:", fusionResult.aiDecision);
    console.log("Strategy Decision:", fusionResult.strategyDecision);
    console.log("Strategy Votes:", fusionResult.strategyVotes);
    console.log("Final Decision:", fusionResult.finalDecision);
    console.log("AI Confidence:", fusionResult.aiConfidence);
    console.log("Strategy Confidence:", fusionResult.strategyConfidence);
    console.log("Final Confidence:", fusionResult.finalConfidence);
    console.log("AI Agree:", fusionResult.aiAgrees);
    console.log("Fusion Reason:", fusionResult.fusionReason);
    console.log("=======================================");

    // ======================
    // LOGS
    // ======================
    // console.log("Market Score:", analysis.marketScores);
    console.log("Votes:", analysis.votes);
    console.log("========== BOT DATA ==========");
    console.log("RSI:", latestRSI.toFixed(2));
    console.log("Current Price:", currentPrice);
    console.log("Last Price:", lastPrice);
    console.log("Trend:", analysisM.trend.toFixed(2));
    console.log("Volatility:", analysisM.volatility.toFixed(2));
    console.log("Momentum:", analysisM.momentum.toFixed(2));
    console.log("Support:", analysisM.supportLevel);
    console.log("Resistance:", analysisM.resistanceLevel);
    console.log("Latest EMA 20:", latestEMA20);
    console.log("Latest EMA 50:", latestEMA50);
    console.log("Latest MACD:", latestMACD);
    console.log("Latest MACD Signal:", latestSignal);
    console.log("Latest MACD Histogram:", latestHistogram);
    console.log("Bot State Highest Price:", botState.highestPrice);
    console.log("Bot State Trailing Stop Price:", botState.trailingStopPrice);
    console.log("SOL Holding:", botState.solHolding);
    console.log("Market:", analysis.marketType);
    console.log("Strategy:", analysis.strategyUsed);
    console.log("Action:", action.leadingDecision);
    console.log("================================");

    // ======================
    // EXECUTE BUY
    // ======================

    if (action.leadingDecision === "BUY" || action.leadingDecision === "buy") {
      botState.botMode = "BUYING";
      // console.log( "BUY SIGNAL DETECTED" );
      // botState.currentStrategy = "Trend Reversal Buy (Bullish)";
      await botState.save();
      await executeBuy(currentPrice);
    }

    // ======================
    // EXECUTE SELL
    // ======================

    if (action.leadingDecision === "SELL" || action.leadingDecision === "sell") {
      botState.botMode = "SELLING";
      // console.log( "TAKE PROFIT SELL" );
      // botState.currentStrategy = "High RSI with Min. Profit (Bearish)";
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
