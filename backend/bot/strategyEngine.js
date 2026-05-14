  // ======================
  // BUY CONDITIONS
  // ======================
  
const getCurrentProfitPercent = ({ botState, currentPrice }) => {
  const investedAmount = botState.solHolding * botState.averageBuyPrice;

  const currentValue = botState.solHolding * currentPrice;

  return investedAmount > 0 ? ((currentValue - investedAmount) / investedAmount) * 100 : 0;
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

  logDecisionVotes("Mean Reversion", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  if ( buyScore >= 5 && botState.solHolding === 0 )
  {
    console.log( "BUY SIGNAL DETECTED" );
    botState.currentStrategy = "Mean Reversion Buy";

    return "BUY";
  }

  if ( sellScore >= 5 && botState.solHolding > 0 )
  {
    console.log( "TAKE PROFIT SELL" );
    botState.currentStrategy = "Mean Reversion Sell";

    return "SELL";
  }

  botState.currentStrategy = "Mean Reversion Hold";

  return "HOLD";

};

// =====================================
// MOMENTUM STRATEGY
// =====================================

const runMomentumStrategy = ({ rsi, trend, momentum, currentPrice, latestEMA20, latestEMA50, latestMACD, latestSignal, volatility, botState }) => {

  let buyScore = 0;
  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });

  // ======================
  // BUY CONDITIONS
  // ======================

  if (rsi < 60)
  {
    buyScore += 2;
  }

  if (trend > 0.3)
  {
    buyScore += 2;
  }

  if (momentum > 0)
  {
    buyScore += 1;
  }

  if (volatility < 8)
  {
    buyScore += 1;
  }

  if ( latestEMA20 > latestEMA50 )
  {
    buyScore += 2;
  }

  if ( hasMACD && latestMACD > latestSignal )
  {
    buyScore += 2;
  }

  // ======================
  // FINAL BUY
  // ======================

  const currentProfit = getCurrentProfitPercent({ botState, currentPrice });

  const sellScore = botState.solHolding > 0 && currentProfit >= 3 && rsi > 70 ? 5 : 0;

  const holdScore = Math.max(0, 7 - Math.max(buyScore, sellScore));

  logDecisionVotes("Momentum", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  if ( buyScore >= 7 && botState.solHolding === 0 )
  {
    console.log( "BUY SIGNAL DETECTED" );
    botState.currentStrategy = "Momentum Bullish Buy";

    return "BUY";
  }

  // ======================
  // TAKE PROFIT
  // ======================

  if ( botState.solHolding > 0 && currentProfit >= 3 && rsi > 70 )
  {
    console.log( "TAKE PROFIT SELL" );
    botState.currentStrategy = "Momentum Profit Sell";

    return "SELL";
  }

  // ======================
  // STOP LOSS
  // ======================

  botState.currentStrategy = "Momentum Hold";

  return "HOLD";

};

// =====================================
// DEFENSIVE STRATEGY
// =====================================

const runDefensiveStrategy = ({ rsi, latestMACD, latestSignal, currentPrice, botState }) => {
  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });
  let sellScore = 0;

  if (rsi < 40)
  {
    sellScore += 3;
  }

  if (hasMACD && latestMACD < latestSignal)
  {
    sellScore += 2;
  }

  const holdScore = Math.max(0, 5 - sellScore);

  logDecisionVotes("Defensive", {
    BUY: 0,
    SELL: sellScore,
    HOLD: holdScore
  });

  // ======================
  // DEFENSIVE SELL
  // ======================

  const currentProfitPercent = ( ( currentPrice - botState.averageBuyPrice ) / botState.averageBuyPrice ) * 100;

  if ( botState.solHolding > 0 && currentProfitPercent <= -1.5 && sellScore >= 4 )
  {
    console.log( "DEFENSIVE SELL DETECTED" );
    botState.currentStrategy = "Defensive Exit";
    console.log("Current Profit:", currentProfitPercent);  
    return "SELL";
  }
  
  console.log("Current Profit:", currentProfitPercent);
  botState.currentStrategy = "Defensive Hold";

  return "HOLD";

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
    logDecisionVotes("Grid", {
      BUY: 0,
      SELL: 0,
      HOLD: 10
    });

    console.log( "HIGH VOLATILITY DETECTED" );
    botState.currentStrategy = "Extreme Volatility Hold";

    return "HOLD";
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

  logDecisionVotes("Grid", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  if (
    buyScore >= 6 &&
    botState.solHolding === 0
  )
  {
    console.log( "GRID BUY DETECTED" );
    botState.currentStrategy = "Grid Buy";

    return "BUY";
  }

  // ======================
  // GRID SELL
  // ======================

  if ( sellScore >= 5 && botState.solHolding > 0 )
  {
    console.log( "GRID SELL DETECTED" );
    botState.currentStrategy = "Grid Sell";
    return "SELL";
  }

  botState.currentStrategy = "Grid Hold";

  return "HOLD";

};

// =====================================
// MAIN STRATEGY ENGINE
// =====================================

const decideTrade = (data) => {

  const { marketType, rsi, currentPrice, resistanceLevel, latestEMA20, latestEMA50, latestMACD, latestSignal, volatility, botState
  } = data;

  if (!botState) {
    return "HOLD";
  }

  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });

  // ======================
  // GLOBAL RISK EXITS
  // ======================

  if (botState.solHolding > 0 && currentPrice <= botState.trailingStopPrice) {
    logDecisionVotes("Global Risk Exit", {
      BUY: 0,
      SELL: 10,
      HOLD: 0
    });

    console.log("TRAILING STOP DETECTED");
    botState.currentStrategy = "Global Trailing Stop";

    return "SELL";
  }

  const currentProfit = getCurrentProfitPercent({ botState, currentPrice });

  console.log("Current Profit:", currentProfit.toFixed(2) + "%");

  if ( botState.solHolding > 0 && currentProfit >= 3 && ( rsi > 70 || currentPrice >= resistanceLevel || latestEMA20 < latestEMA50 ||
      (hasMACD && latestMACD < latestSignal) ) )
  {
    logDecisionVotes("Global Profit Protection", {
      BUY: 0,
      SELL: 8,
      HOLD: 0
    });

    console.log("GLOBAL PROFIT PROTECTION SELL");
    botState.currentStrategy = "Global Profit Protection";

    return "SELL";
  }

  if (botState.solHolding === 0 && volatility > 10) {
    logDecisionVotes("Volatility Trap", {
      BUY: 0,
      SELL: 0,
      HOLD: 10
    });

    console.log("VOLATILITY TRAP AVOIDED");
    botState.currentStrategy = "Volatility Trap Avoided";

    return "HOLD";
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
  logDecisionVotes("Unknown Market", {
    BUY: 0,
    SELL: 0,
    HOLD: 1
  });

  botState.currentStrategy = "Unknown Market Hold";
  return "HOLD";

};

module.exports = decideTrade;
