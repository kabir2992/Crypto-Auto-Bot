const decideTrade = ({ rsi, trend, volatility, momentum, supportLevel, resistanceLevel, latestEMA20, latestEMA50, latestMACD, latestSignal, currentPrice, botState }) => {

  if (!botState) {

    return "HOLD";

  }

  botState.currentStrategy = "Tred + Momentum + RSI";
  
  // ======================
  // BUY CONDITIONS
  // ======================
  
  let buyScore = 0;
  const hasMACD = latestMACD !== null && latestSignal !== null && latestMACD !== undefined && latestSignal !== undefined;
  
  if (rsi < 60) buyScore += 2;
  if (trend < -0.3) buyScore += 2;
  if (momentum > 0) buyScore += 1;
  if (currentPrice <= supportLevel * 1.01) buyScore += 2;
  if (volatility < 8) buyScore += 1;
  if (hasMACD && latestMACD > latestSignal) buyScore +=2;

  console.log("Buy Score: ",buyScore);

  if (buyScore >= 7 && latestEMA20 > latestEMA50) {
    console.log( "BUY SIGNAL DETECTED" );
    botState.currentStrategy = "Trend Reversal Buy (Bullish)";
    return "BUY";
  }
  
  // ======================
  // STOP LOSS
  // ======================
  
  const stopLossSignal = botState.solHolding > 0 && currentPrice <= botState.trailingStopPrice;
  
  if (stopLossSignal) {
    botState.currentStrategy = "Trailing Stop Loss";
    console.log( "STOP LOSS SELL" );
    return "SELL";
  }
  
  // ======================
  // TAKE PROFIT
  // ======================
  
  // ======================
  // CURRENT PROFIT
  // ======================

  const investedAmount = botState.solHolding * botState.averageBuyPrice;

  const currentValue = botState.solHolding * currentPrice;

  const currentProfit = botState.solHolding > 0 ? currentValue - investedAmount : 0;

  const currentProfitPercent = investedAmount > 0 ? (currentProfit / investedAmount) * 100 : 0;

  const takeProfitSignal = botState.solHolding > 0 && ( currentProfitPercent >= 3 && rsi > 70 && currentPrice >= resistanceLevel && latestEMA20 < latestEMA50 && hasMACD && latestMACD < latestSignal);

  if (takeProfitSignal) {
    console.log( "TAKE PROFIT SELL" );
    botState.currentStrategy = "High RSI with Min. Profit (Bearish)";
    return "SELL";
  }

  // ======================
  // HIGH VOLATILITY SAFETY
  // ======================

  const highVolatility = volatility > 8;

  if (highVolatility) {
    console.log( "HIGH VOLATILITY HOLD" );
    botState.currentStrategy = "High Volatility Rate";
    return "HOLD";
  }

  // ======================
  // DEFAULT HOLD
  // ======================
  botState.currentStrategy = "Neutral RSI and No Margin for Profit";
  return "HOLD";

};

module.exports = decideTrade;
