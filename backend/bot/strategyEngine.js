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

  if ( buyScore >= 5 || botState.solHolding === 0)
  {
    console.log( "BUY SIGNAL DETECTED" );
    botState.currentStrategy = "Mean Reversion Buy";

    return "BUY";
  }

  if ( sellScore === 5 && botState.solHolding > 0 )
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
  if (rsi > 75)
  {
    sellScore += 2;
  }

  // MACD Bearish Cross
  if ( hasMACD && latestMACD < latestSignal )
  {
    sellScore += 2;
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
  if (currentProfit >= 2)
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

  logDecisionVotes(
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

  if ( ( buyScore > sellScore && buyScore >= 7 ) || botState.solHolding === 0 )
  {
    console.log( "BUY SIGNAL DETECTED" );

    botState.currentStrategy = "Momentum Bullish Buy";

    return "BUY";
  }

  // ======================
  // SELL DECISION
  // ======================

  if ( sellScore > buyScore && sellScore >= 5 && botState.solHolding > 0 )
  {
    console.log( "TAKE PROFIT SELL" );

    botState.currentStrategy = "Momentum Profit Sell";

    return "SELL";
  }

  // ======================
  // HOLD DECISION
  // ======================

  // Bullish Hold
  if ( buyScore === sellScore && botState.solHolding >= 0 )
  {
    botState.currentStrategy = "Momentum Bullish Hold";

    return "HOLD";
  }

  // Neutral Hold
  botState.currentStrategy = "Momentum Neutral Hold";

  return "HOLD";

};

// =====================================
// DEFENSIVE STRATEGY
// =====================================

const runDefensiveStrategy = ({ rsi, latestMACD, latestSignal, currentPrice, supportLevel, botState }) => {
  const hasMACD = hasMACDSignal({ latestMACD, latestSignal });
  let sellScore = 0;
  let buyScore = 0;

  // SELL Scores Counting
  if (rsi < 40)
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

  logDecisionVotes(
    "Defensive",
    {
      BUY: buyScore,
      SELL: sellScore,
      HOLD: holdScore
    }
  );

  logDecisionVotes("Defensive", {
    BUY: buyScore,
    SELL: sellScore,
    HOLD: holdScore
  });

  // ======================
  // DEFENSIVE SELL
  // ======================

  const currentProfitPercent = ( ( currentPrice - botState.averageBuyPrice ) / botState.averageBuyPrice ) * 100;

  if ( botState.solHolding > 0 && (( currentProfitPercent >= 0 && sellScore >= 4 && sellScore > buyScore ) || currentProfitPercent >= -0.5 ) )
  {
    console.log( "DEFENSIVE SELL DETECTED" );
    botState.currentStrategy = "Defensive Profit Exit";
    console.log("Current Profit:", currentProfitPercent);  
    return "SELL";
  }
  
  // ======================
  // DEFENSIVE BUY
  // ======================

  if ( buyScore >= 4 && buyScore > sellScore || botState.solHolding === 0 )
  {
    console.log( "DEFENSIVE BUY DETECTED" );
    botState.currentStrategy = "Defensive Buy Exit";
    return "BUY";
  }

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

  if ( buyScore >= 6 || botState.solHolding === 0 )
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

  if ( botState.solHolding > 0 && currentProfit >= 2 && ( rsi > 70 || currentPrice >= resistanceLevel || latestEMA20 < latestEMA50 ||
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
