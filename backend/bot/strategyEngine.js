const decideTrade = ({ rsi, trend, volatility, momentum, supportLevel, resistanceLevel, latestEMA20, latestEMA50, currentPrice, botState }) => {

  if (!botState) {

    return "HOLD";

  }

  botState.currentStrategy = "Tred + Momentum + RSI";
  // ======================
  // CURRENT PROFIT
  // ======================

  const investedAmount = botState.solHolding * botState.averageBuyPrice;

  const currentValue = botState.solHolding * currentPrice;

  const currentProfit = botState.solHolding > 0 ? currentValue - investedAmount : 0;

  const currentProfitPercent = investedAmount > 0 ? (currentProfit / investedAmount) * 100 : 0;

  // ======================
  // BUY CONDITIONS
  // ======================

  let buyScore = 0;

  if (rsi < 60) buyScore += 2;
  if (trend < -0.3) buyScore += 2;
  if (momentum > 0) buyScore += 1;
  if (currentPrice <= supportLevel * 1.01) buyScore += 2;
  if (volatility < 8) buyScore += 1;
  console.log("Buy Score: ",buyScore);

  if (buyScore >= 5 && latestEMA20 > latestEMA50) {
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

  const takeProfitSignal = botState.solHolding > 0 && ( currentProfitPercent >= 3 && rsi > 70 && currentPrice >= resistanceLevel && latestEMA20 < latestEMA50);

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
