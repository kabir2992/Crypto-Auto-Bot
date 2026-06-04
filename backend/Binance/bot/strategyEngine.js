const Position = require("../models/Position");

// =====================================
// HELPERS
// =====================================

const hasOpenLongPositions = async () => {

  const count = await Position.countDocuments({
    side: "LONG",
    status: "OPEN"
  });

  return count > 0;
};

const hasOpenShortPositions = async () => {

  const count = await Position.countDocuments({
    side: "SHORT",
    status: "OPEN"
  });

  return count > 0;
};

const getCurrentProfitPercent = ({ botState, currentPrice }) => {

  const investedAmount = botState.solHolding * botState.averageBuyPrice;

  const currentValue = botState.solHolding * currentPrice;

  return investedAmount > 0
    ? ((currentValue - investedAmount) / investedAmount) * 100
    : 0;
};

const getMinimumLongSellPrice = ({ botState }) => {

  const referenceBuyPrice =
    botState.minimumSellPrice ||
    botState.lastBuyPrice ||
    botState.averageBuyPrice ||
    0;

  if (botState.minimumSellPrice > 0) {
    return botState.minimumSellPrice;
  }

  return referenceBuyPrice > 0
    ? referenceBuyPrice + 1
    : 0;
};

const canSellLongAtMinimumProfit = ({ botState, currentPrice }) => {

  const minimumSellPrice = getMinimumLongSellPrice({ botState });

  return (
    botState.solHolding > 0 &&
    minimumSellPrice > 0 &&
    currentPrice >= minimumSellPrice
  );
};

const hasMACDSignal = ({ latestMACD, latestSignal }) => {

  return (
    latestMACD !== null &&
    latestSignal !== null &&
    latestMACD !== undefined &&
    latestSignal !== undefined
  );
};

const logDecisionVotes = (strategyName, votes) => {

  const winner = Object.entries(votes).reduce(
    (highest, current) =>
      current[1] > highest[1]
        ? current
        : highest
  );

  console.log("========== DECISION VOTES ==========");
  console.log("Strategy:", strategyName);
  console.log("BUY Votes:", votes.BUY);
  console.log("SELL Votes:", votes.SELL);
  console.log("HOLD Votes:", votes.HOLD);
  console.log("Leading Decision:", winner[0]);
  console.log("====================================");

  return {
    strategyName,
    votes,
    leadingDecision: winner[0],
    votesForFusion: {
      buy: votes.BUY,
      sell: votes.SELL,
      hold: votes.HOLD
    }
  };
};

const createStrategyResult = ({ action, voteData }) => {

  return {
    action,
    strategyName: voteData.strategyName,
    votes: voteData.votes,
    votesForFusion: voteData.votesForFusion,
    leadingDecision: voteData.leadingDecision
  };
};

// =====================================
// MEAN REVERSION STRATEGY
// =====================================

const runMeanReversion = async ({
  rsi,
  currentPrice,
  supportLevel,
  resistanceLevel,
  volatility,
  botState
}) => {

  let buyScore = 0;
  let sellScore = 0;

  const hasShorts = await hasOpenShortPositions();

  // BUY CONDITIONS

  if (rsi < 45) {
    buyScore += 2;
  }

  if (currentPrice <= supportLevel * 1.01) {
    buyScore += 3;
  }

  if (volatility < 5) {
    buyScore += 1;
  }

  // SELL CONDITIONS

  if (rsi > 65) {
    sellScore += 2;
  }

  if (currentPrice >= resistanceLevel * 0.99) {
    sellScore += 3;
  }

  const holdScore = Math.max(0, 5 - Math.max(buyScore, sellScore));

  const voteData =
    logDecisionVotes("Mean Reversion", {
      BUY: buyScore,
      SELL: sellScore,
      HOLD: holdScore
    });

  // LONG BUY

  if ( buyScore >= 5 && !hasShorts )
  {
      console.log( "BUY SIGNAL DETECTED" );
      botState.currentStrategy = "Mean Reversion Buy";

    return createStrategyResult({
      action: "LONG_BUY",
      voteData
    });
  }

  // LONG SELL

  if ( sellScore >= 5 && canSellLongAtMinimumProfit({ botState, currentPrice }) )
  {
    console.log( "TAKE PROFIT SELL" );
    botState.currentStrategy = "Mean Reversion Sell";

    return createStrategyResult({
      action: "LONG_SELL",
      voteData
    });
  }

  // if (sellScore === 5 && botState.solHolding > 0)
  // {
  //   logSellBlocked({ strategyName: "Mean Reversion", currentPrice, botState });
  // }

  botState.currentStrategy = "Mean Reversion Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });
};

// =====================================
// MOMENTUM STRATEGY
// =====================================

const runMomentumStrategy = async ({
  rsi,
  trend,
  momentum,
  currentPrice,
  latestEMA20,
  latestEMA50,
  latestMACD,
  latestSignal,
  volatility,
  botState
}) => {

  let buyScore = 0;
  let sellScore = 0;

  const hasShorts = await hasOpenShortPositions();

  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });

  const currentProfit = getCurrentProfitPercent({ botState, currentPrice });

  const canSellProfit = canSellLongAtMinimumProfit({ botState, currentPrice });

  console.log( "Current Profit:", currentProfit.toFixed(2) + "%" );
  console.log( "Can Sell Profit:", canSellProfit ? "YES" : "NO" );

  // BUY CONDITIONS

  if (rsi < 65) {
    buyScore += 2;
  }

  if (trend > 0.03) {
    buyScore += 2;
  }

  if (momentum > 0) {
    buyScore += 1;
  }

  if (volatility < 8) {
    buyScore += 1;
  }

  if (latestEMA20 > latestEMA50) {
    buyScore += 2;
  }

  if (hasMACD && latestMACD > latestSignal) {
    buyScore += 2;
  }

  // SELL CONDITIONS

  if (rsi > 65) {
    sellScore += 2;
  }

  if (hasMACD && latestMACD < latestSignal) {
    sellScore += 3;
  }

  if (momentum <= 0) {
    sellScore += 1;
  }

  if (trend < -0.03) {
    sellScore += 2;
  }

  if (currentProfit >= 1.5 && canSellProfit) {
    sellScore += 2;
  }

  const holdScore = Math.max(0, 10 - Math.max(buyScore, sellScore));

  const voteData =
    logDecisionVotes("Momentum", {
      BUY: buyScore,
      SELL: sellScore,
      HOLD: holdScore
    });

  // LONG BUY

  if ( buyScore > sellScore && buyScore >= 7 && !hasShorts )
  {
    console.log( "BUY SIGNAL DETECTED" );
    botState.currentStrategy = "Momentum Bullish Buy";

    return createStrategyResult({
      action: "LONG_BUY",
      voteData
    });
  }

  // LONG SELL

  if ( sellScore > buyScore && sellScore >= 7 && canSellProfit )
  {
    console.log( "TAKE PROFIT SELL" );
    botState.currentStrategy = "Momentum Profit Sell";

    return createStrategyResult({
      action: "LONG_SELL",
      voteData
    });
  }

  // Bullish Hold
  if ( buyScore === sellScore)
    {
      botState.currentStrategy = "Momentum Bullish Hold";
      return createStrategyResult({ action: "HOLD", voteData });
    }
    
  // Neutral Hold
  botState.currentStrategy = "Momentum Neutral Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });
};

// =======================================================
// DEFENSIVE STRATEGY - SHORT MARKET TRADE STRATEGY
// =======================================================

const runDefensiveStrategy = async ({
  rsi,
  momentum,
  latestMACD,
  latestSignal,
  currentPrice,
  supportLevel,
  botState
}) => {

  let buyScore = 0;
  let sellScore = 0;

  const hasLongs = await hasOpenLongPositions();

  const hasShorts = await hasOpenShortPositions();

  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });

  // SHORT CONDITIONS

  if (rsi < 45) {
    sellScore += 3;
  }

  if (hasMACD) {
    sellScore += 1;
  }

  if (latestMACD < latestSignal) {
    sellScore += 2;
  }

  if (momentum < 0) {
    sellScore += 1;
  }

  // SHORT CLOSE CONDITIONS

  if (rsi < 35) {
    buyScore += 2;
  }

  if (currentPrice <= supportLevel * 1.01) {
    buyScore += 2;
  }

  if (momentum >= 0) {
    buyScore += 1;
  }

  const holdScore = Math.max(0, 5 - Math.max(buyScore, sellScore));

  const voteData =
    logDecisionVotes("Defensive", {
      BUY: buyScore,
      SELL: sellScore,
      HOLD: holdScore
    });

  // SHORT ENTRY

  if ( sellScore >= 5 && sellScore > buyScore && !hasShorts )
  {
    console.log( "DEFENSIVE SHORT ENTRY DETECTED" );
    botState.currentStrategy = "Defensive Short Bought";

    return createStrategyResult({
      action: "SHORT_SELL",
      voteData
    });
  }

  // SHORT CLOSE

  if ( hasShorts && buyScore >= 4 )
  {
    console.log(" DEFENSIVE SHORT CLOSE DETECTED ");
    botState.currentStrategy = "Defensive Short Close";

    return createStrategyResult({
      action: "SHORT_CLOSE",
      voteData
    });
  }

  botState.currentStrategy = "Defensive Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });
};

// =====================================
// GRID STRATEGY
// =====================================

const runGridStrategy = async ({
  rsi,
  currentPrice,
  supportLevel,
  resistanceLevel,
  volatility,
  latestEMA20,
  latestEMA50,
  latestMACD,
  latestSignal,
  botState
}) => {

  let buyScore = 0;
  let sellScore = 0;

  const hasShorts = await hasOpenShortPositions();

  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });

  // ========================
  // HIGH VOLATILITY SAFETY 
  // ========================
  
  if (volatility > 10) {

    const voteData =
      logDecisionVotes("Grid", {
        BUY: 0,
        SELL: 0,
        HOLD: 10
      });

      console.log( "HIGH VOLATILITY DETECTED" );
      botState.currentStrategy = "Extreme Volatility Hold";

    return createStrategyResult({
      action: "HOLD",
      voteData
    });
  }

  // ======================
  // GRID BUY
  // ======================

  if (currentPrice <= supportLevel) {
    buyScore += 2;
  }

  if (rsi < 55) {
    buyScore += 1;
  }

  if (latestEMA20 >= latestEMA50) {
    buyScore += 2;
  }

  if (hasMACD && latestMACD >= latestSignal) {
    buyScore += 2;
  }

  if (currentPrice >= resistanceLevel) {
    sellScore += 3;
  }

  if (botState.solHolding > 0) {
    sellScore += 2;
  }

  const holdScore = Math.max(0, 6 - Math.max(buyScore, sellScore));

  const voteData =
    logDecisionVotes("Grid", {
      BUY: buyScore,
      SELL: sellScore,
      HOLD: holdScore
    });

  // LONG BUY

  if ( buyScore >= 6 && !hasShorts )
  {
    console.log( "GRID BUY DETECTED" );
    botState.currentStrategy = "Grid Buy";

    return createStrategyResult({
      action: "LONG_BUY",
      voteData
    });
  }

  // ======================
  // GRID SELL
  // ======================

  if ( sellScore >= 5 && canSellLongAtMinimumProfit({ botState, currentPrice }) )
  {
    console.log( "GRID SELL DETECTED" );
    botState.currentStrategy = "Grid Sell";

    return createStrategyResult({
      action: "LONG_SELL",
      voteData
    });
  }

  botState.currentStrategy = "Grid Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });
};

// =====================================
// MAIN STRATEGY ENGINE
// =====================================

const decideTrade = async (data) => {

  const {
    marketType,
    rsi,
    currentPrice,
    resistanceLevel,
    latestEMA20,
    latestEMA50,
    latestMACD,
    latestSignal,
    volatility,
    botState
  } = data;

  if (!botState) {

    const voteData =
      logDecisionVotes("No BotState", {
        BUY: 0,
        SELL: 0,
        HOLD: 1
      });

    return createStrategyResult({
      action: "HOLD",
      voteData
    });
  }

  const hasMACD =
    hasMACDSignal({
      latestMACD,
      latestSignal
    });

  const currentProfit =
    getCurrentProfitPercent({
      botState,
      currentPrice
    });

  // GLOBAL LONG SELL

  if ( botState.solHolding > 0 && currentProfit >= 1.5 &&
    (
      rsi > 65 ||
      currentPrice >= resistanceLevel ||
      latestEMA20 < latestEMA50 ||
      (hasMACD && latestMACD < latestSignal)
    )
  )
  {
    const voteData =
    logDecisionVotes("Global Profit Protection", {
      BUY: 0,
      SELL: 8,
      HOLD: 0
    });

    console.log("GLOBAL PROFIT PROTECTION SELL");
    botState.currentStrategy = "Global Profit Protection";

    return createStrategyResult({
      action: "LONG_SELL",
      voteData
    });
  }

  // VOLATILITY HOLD

  if ( botState.solHolding === 0 && volatility > 10 )
  {
    const voteData =
      logDecisionVotes("Volatility Hold", {
        BUY: 0,
        SELL: 0,
        HOLD: 10
      });

    console.log("VOLATILITY TRAP AVOIDED");
    botState.currentStrategy = "Volatility Trap Avoided";

    return createStrategyResult({
      action: "HOLD",
      voteData
    });
  }

  // MARKET TYPES

  // ====================== 
  // SIDEWAYS MARKET
  // ======================

  if (marketType === "SIDEWAYS") {
    console.log("SIDEWAYS Strategy Selected");
    return await runMeanReversion(data);
  }

  // ====================== 
  // BULLISH MARKET
  // ======================

  if (marketType === "BULLISH") {
    return await runMomentumStrategy(data);
  }

  // ====================== 
  // BEARISH MARKET
  // ======================

  if (marketType === "BEARISH") {
    return await runDefensiveStrategy(data);
  }

  // ====================== 
  // VOLATILE MARKET
  // ======================

  if (marketType === "VOLATILE") {
    return await runGridStrategy(data);
  }

  // ====================== 
  // DEFAULT HOLD
  // ======================

  const voteData =
    logDecisionVotes("Unknown Market", {
      BUY: 0,
      SELL: 0,
      HOLD: 1
    });

  botState.currentStrategy = "Unknown Market Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });
};

module.exports = decideTrade;