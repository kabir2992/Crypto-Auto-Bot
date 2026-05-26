  // ======================
  // BUY CONDITIONS
  // ======================
  
const getCurrentProfitPercent = ({ botState, currentPrice }) => {
  const investedAmount = botState.solHolding * botState.averageBuyPrice;

  const currentValue = botState.solHolding * currentPrice;

  return investedAmount > 0 ? ((currentValue - investedAmount) / investedAmount) * 100 : 0;
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

  return referenceBuyPrice > 0 ? referenceBuyPrice + 1 : 0;
};

const canSellLongAtMinimumProfit = ({ botState, currentPrice }) => {
  const minimumSellPrice = getMinimumLongSellPrice({ botState });

  return (
    botState.solHolding > 0 &&
    minimumSellPrice > 0 &&
    currentPrice >= minimumSellPrice
  );
};

const logSellBlocked = ({ strategyName, currentPrice, botState }) => {
  console.log(`${strategyName} SELL BLOCKED`);
  console.log("Current Price:", currentPrice);
  console.log("Last Buy Price:", botState.lastBuyPrice || botState.averageBuyPrice);
  console.log("Minimum Long Sell Price:", getMinimumLongSellPrice({ botState }));
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
    (highest, current) => current[1] > highest[1] ? current : highest
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

// ======================
// BUY CONDITIONS
// ======================

const runMeanReversion = ({ rsi, currentPrice, supportLevel, resistanceLevel, volatility, botState }) => {

  let buyScore = 0;

  let sellScore = 0;

  // ======================
  // BUY CONDITIONS
  // ======================

  if (rsi < 45)
  {
    buyScore += 2;
  }

  if ( currentPrice <= supportLevel * 1.01 )
  {
    buyScore += 3;
  }

  if (volatility < 5)
  {
    buyScore += 1;
  }

  // ======================
  // SELL CONDITIONS
  // ======================

  if (rsi > 65)
  {
    sellScore += 2;
  }

  if ( currentPrice >= resistanceLevel * 0.99 )
  {
    sellScore += 3;
  }

  // ======================
  // FINAL DECISION
  // ======================

  const holdScore = Math.max(0, 5 - Math.max(buyScore, sellScore));

  const voteData = logDecisionVotes("Mean Reversion", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  if ( buyScore >= 5 && botState.solHolding === 0 )
  {
    console.log( "BUY SIGNAL DETECTED" );
    botState.currentStrategy = "Mean Reversion Buy";

    return createStrategyResult({
      action: "BUY",
      voteData
    });
  }

  if ( sellScore === 5 && canSellLongAtMinimumProfit({ botState, currentPrice }) )
  {
    console.log( "TAKE PROFIT SELL" );
    botState.currentStrategy = "Mean Reversion Sell";

    return createStrategyResult({
      action: "SELL",
      voteData
    });
  }

  if (sellScore === 5 && botState.solHolding > 0) {
    logSellBlocked({
      strategyName: "Mean Reversion",
      currentPrice,
      botState
    });
  }

  botState.currentStrategy = "Mean Reversion Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });

};

// =====================================
// MOMENTUM STRATEGY
// =====================================

// =====================================
// MOMENTUM STRATEGY
// =====================================

const runMomentumStrategy = ({
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

  // ======================
  // INITIAL SCORES
  // ======================

  let buyScore = 0;

  let sellScore = 0;

  // ======================
  // MACD CHECK
  // ======================

  const hasMACD =
    hasMACDSignal({
      latestMACD,
      latestSignal
    });

  // ======================
  // CURRENT PROFIT
  // ======================

  const currentProfit =
    getCurrentProfitPercent({
      botState,
      currentPrice
    });

  const canSellProfit = canSellLongAtMinimumProfit({ botState, currentPrice });

  console.log( "Current Profit:", currentProfit.toFixed(2) + "%" );

  // ======================
  // BUY CONDITIONS
  // ======================

  // Healthy RSI
  if (rsi < 65)
  {
    buyScore += 2;
  }

  // Bullish Trend
  if (trend > 0.03)
  {
    buyScore += 2;
  }

  // Positive Momentum
  if (momentum > 0)
  {
    buyScore += 1;
  }

  // Safe Volatility
  if (volatility < 8)
  {
    buyScore += 1;
  }

  // EMA Bullish Crossover
  if (latestEMA20 > latestEMA50)
  {
    buyScore += 2;
  }

  // MACD Bullish
  if ( hasMACD && latestMACD > latestSignal )
  {
    buyScore += 2;
  }

  // ======================
  // SELL CONDITIONS
  // ======================

  // RSI Overbought
  if (rsi > 65)
  {
    sellScore += 2;
  }

  // MACD Bearish Cross
  if ( hasMACD && latestMACD < latestSignal )
  {
    sellScore += 3;
  }

  // Momentum Weakening
  if (momentum <= 0)
  {
    sellScore += 1;
  }

  // Trend Reversal
  if (trend < -0.03)
  {
    sellScore += 2;
  }

  // Profit Available
  if (currentProfit >= 1.5 && canSellProfit)
  {
    sellScore += 2;
  }

  // ======================
  // HOLD SCORE
  // ======================

  const holdScore =
    Math.max( 0, 10 - Math.max(buyScore, sellScore) );

  // ======================
  // DECISION LOGS
  // ======================

  const voteData = logDecisionVotes(
    "Momentum",
    {
      BUY: buyScore,
      SELL: sellScore,
      HOLD: holdScore
    }
  );

  // ======================
  // BUY DECISION
  // ======================

  if ( buyScore > sellScore && buyScore >= 7 || botState.solHolding === 0 )
  {
    console.log( "BUY SIGNAL DETECTED" );

    botState.currentStrategy = "Momentum Bullish Buy";

    return createStrategyResult({
      action: "BUY",
      voteData
    });
  }

  // ======================
  // SELL DECISION
  // ======================

  if ( sellScore > buyScore && sellScore >= 7 && canSellProfit )
  {
    console.log( "TAKE PROFIT SELL" );

    botState.currentStrategy = "Momentum Profit Sell";

    return createStrategyResult({
      action: "SELL",
      voteData
    });
  }

  if (sellScore > buyScore && sellScore >= 7 && botState.solHolding > 0) {
    logSellBlocked({
      strategyName: "Momentum",
      currentPrice,
      botState
    });
  }

  // ======================
  // HOLD DECISION
  // ======================

  // Bullish Hold
  if ( buyScore === sellScore && botState.solHolding >= 0 )
  {
    botState.currentStrategy = "Momentum Bullish Hold";

    return createStrategyResult({
      action: "HOLD",
      voteData
    });
  }

  // Neutral Hold
  botState.currentStrategy = "Momentum Neutral Hold";

  return createStrategyResult({
    action: "HOLD",
    voteData
  });

};

// =====================================
// DEFENSIVE STRATEGY
// =====================================

const runDefensiveStrategy = ({ rsi, momentum, latestMACD, latestSignal, currentPrice, supportLevel, botState }) => {
  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });
  let sellScore = 0;
  let buyScore = 0;

  // SELL Scores Counting
  if (rsi < 25)
  {
    sellScore += 3;
  }

  if ( hasMACD )
  {
    sellScore += 1;
  }

  if ( latestMACD < latestSignal )
  {
    sellScore +=2;
  }

  // BUY Scores Counting
  if (rsi < 35)
  {
    buyScore += 2;
  }

  if (currentPrice <= supportLevel * 1.01)
  {
    buyScore += 2;
  }

  if (momentum >= 0)
  {
    buyScore += 1;
  }

  // ======================
  // HOLD SCORE
  // ======================

  const holdScore =
    Math.max( 0 , 5 - Math.max(buyScore, sellScore) );

  // ======================
  // DECISION LOGS
  // ======================

  const voteData = logDecisionVotes("Defensive", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  // ======================
  // DEFENSIVE SELL
  // ======================

  // const currentProfitPercent = ( ( currentPrice - botState.averageBuyPrice ) / botState.averageBuyPrice ) * 100;

  // if ( botState.solHolding > 0 && (( currentProfitPercent >= 0 && sellScore >= 4 && sellScore > buyScore ) || currentProfitPercent >= -0.01 ) )
  // {
  //   console.log( "DEFENSIVE SELL DETECTED" );
  //   botState.currentStrategy = "Defensive Profit Exit";
  //   console.log("Current Profit:", currentProfitPercent);  
  //   return "SELL";
  // }
  
  // ======================
  // DEFENSIVE BUY
  // ======================

  if ( buyScore >= 4 && buyScore > sellScore && botState.solHolding === 0 )
  {
    console.log( "DEFENSIVE BUY DETECTED" );
    botState.currentStrategy = "Defensive Buy Exit";
    return createStrategyResult({
      action: "BUY",
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

const runGridStrategy = ({ rsi, currentPrice, supportLevel, resistanceLevel, volatility, latestEMA20, latestEMA50, latestMACD, latestSignal, botState }) => {
  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });
  let buyScore = 0;
  let sellScore = 0;

  // ======================
  // HIGH VOLATILITY SAFETY
  // ======================

  if (volatility > 10)
  {
    const voteData = logDecisionVotes("Grid", {
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

  if (currentPrice <= supportLevel)
  {
    buyScore += 2;
  }

  if (botState.solHolding === 0)
  {
    buyScore += 1;
  }

  if (rsi < 55)
  {
    buyScore += 1;
  }

  if (latestEMA20 >= latestEMA50)
  {
    buyScore += 2;
  }

  if (hasMACD && latestMACD >= latestSignal)
  {
    buyScore += 2;
  }

  if (currentPrice >= resistanceLevel)
  {
    sellScore += 3;
  }

  if (botState.solHolding > 0)
  {
    sellScore += 2;
  }

  const holdScore =
    Math.max(0, 6 - Math.max(buyScore, sellScore));

  const voteData = logDecisionVotes("Grid", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  if ( buyScore >= 6 && botState.solHolding === 0 )
  {
    console.log( "GRID BUY DETECTED" );
    botState.currentStrategy = "Grid Buy";

    return createStrategyResult({
      action: "BUY",
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
      action: "SELL",
      voteData
    });
  }

  if (sellScore >= 5 && botState.solHolding > 0) {
    logSellBlocked({
      strategyName: "Grid",
      currentPrice,
      botState
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

const decideTrade = (data) => {

  const { marketType, rsi, currentPrice, resistanceLevel, latestEMA20, latestEMA50, latestMACD, latestSignal, volatility, botState
  } = data;

  if (!botState) {
    const voteData = logDecisionVotes("No BotState", {
      BUY: 0,
      SELL: 0,
      HOLD: 1
    });

    return createStrategyResult({
      action: "HOLD",
      voteData
    });
  }

  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });

  // ======================
  // GLOBAL RISK EXITS
  // ======================

  if (
    botState.solHolding > 0 &&
    currentPrice <= botState.trailingStopPrice &&
    canSellLongAtMinimumProfit({ botState, currentPrice })
  ) {
    const voteData = logDecisionVotes("Global Risk Exit", {
      BUY: 0,
      SELL: 10,
      HOLD: 0
    });

    console.log("TRAILING STOP DETECTED");
    botState.currentStrategy = "Global Trailing Stop";

    return createStrategyResult({
      action: "SELL",
      voteData
    });
  }

  if (botState.solHolding > 0 && currentPrice <= botState.trailingStopPrice) {
    logSellBlocked({
      strategyName: "Global Trailing Stop",
      currentPrice,
      botState
    });
  }

  const currentProfit = getCurrentProfitPercent({ botState, currentPrice });

  console.log("Current Profit:", currentProfit.toFixed(2) + "%");

  if ( botState.solHolding > 0 && currentProfit >= 1.5 && canSellLongAtMinimumProfit({ botState, currentPrice }) && ( rsi > 65 || currentPrice >= resistanceLevel || latestEMA20 < latestEMA50 ||
      (hasMACD && latestMACD < latestSignal) ) )
  {
    const voteData = logDecisionVotes("Global Profit Protection", {
      BUY: 0,
      SELL: 8,
      HOLD: 0
    });

    console.log("GLOBAL PROFIT PROTECTION SELL");
    botState.currentStrategy = "Global Profit Protection";

    return createStrategyResult({
      action: "SELL",
      voteData
    });
  }

  if (botState.solHolding === 0 && volatility > 10) {
    const voteData = logDecisionVotes("Volatility Trap", {
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

  // ======================
  // SIDEWAYS MARKET
  // ======================

  if ( marketType === "SIDEWAYS" )
  {
    console.log("SIDEWAYS Strategy Selected");
    return runMeanReversion( data );
  }

  // ======================
  // BULLISH MARKET
  // ======================

  if ( marketType === "BULLISH" )
  {
    console.log("BULLISH Strategy Selected");
    return runMomentumStrategy( data );
  }

  // ======================
  // BEARISH MARKET
  // ======================

  if ( marketType === "BEARISH" )
  {
    console.log("BEARISH Strategy Selected");
    return runDefensiveStrategy( data );
  }

  // ======================
  // VOLATILE MARKET
  // ======================

  if ( marketType === "VOLATILE" )
  {
    console.log("VOLATILE Strategy Selected");
    return runGridStrategy( data );
  }

  // ======================
  // DEFAULT HOLD
  // ======================
  const voteData = logDecisionVotes("Unknown Market", {
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
