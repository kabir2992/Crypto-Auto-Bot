const decideTrade = ({ rsi, trend, volatility, momentum, supportLevel, resistanceLevel, currentPrice, botState }) => {

  if (!botState) {

    return "HOLD";

  }

  // ======================
  // CURRENT PROFIT
  // ======================

  const currentProfit = botState.solHolding > 0 ? (
    ( currentPrice - botState.averageBuyPrice ) / botState.averageBuyPrice ) * 100 : 0;

  // ======================
  // BUY CONDITIONS
  // ======================

  const strongBuySignal = rsi < 60;

  if (strongBuySignal) {
    console.log( "BUY SIGNAL DETECTED" );
    return "BUY";
  }

  // ======================
  // STOP LOSS
  // ======================

  const stopLossSignal = botState.solHolding > 0 && currentProfit <= -2;

  if (stopLossSignal) {
    console.log( "STOP LOSS SELL" );
    return "SELL";
  }

  // ======================
  // TAKE PROFIT
  // ======================

  const takeProfitSignal = botState.solHolding > 0 && ( currentProfit >= 3 || rsi > 70 || currentPrice >= resistanceLevel * 0.99 );

  if (takeProfitSignal) {
    console.log( "TAKE PROFIT SELL" );
    return "SELL";
  }

  // ======================
  // HIGH VOLATILITY SAFETY
  // ======================

  const highVolatility = volatility > 8;

  if (highVolatility) {
    console.log( "HIGH VOLATILITY HOLD" );
    return "HOLD";
  }

  // ======================
  // DEFAULT HOLD
  // ======================

  return "HOLD";

};

module.exports = decideTrade;