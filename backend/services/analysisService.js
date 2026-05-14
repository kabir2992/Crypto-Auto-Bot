const { getMarketData, clearMarketData } = require("./marketMemory");

const analyzeMarket = () => {

  const data = getMarketData();

  if (data.length < 10) {

    return null;

  }

  const prices = data.map(item => item.price);

  const firstPrice = prices[0];

  const lastPrice = prices[prices.length - 1];

  // ======================
  // TREND
  // ======================

  const trend = ((lastPrice - firstPrice) / firstPrice) * 100;

  // ======================
  // VOLATILITY
  // ======================

  const highest = Math.max(...prices);

  const lowest = Math.min(...prices);

  const volatility = ((highest - lowest) / lowest) * 100;

  // ======================
  // MOMENTUM
  // ======================

  const momentum = lastPrice - prices[ Math.max(0, prices.length - 10) ];

  // ======================
  // SUPPORT
  // ======================

  const supportLevel = lowest;

  // ======================
  // RESISTANCE
  // ======================

  const resistanceLevel = highest;

  console.log(
    "========== ANALYSIS =========="
  );

  console.log("Trend:", trend);

  console.log(
    "Volatility:",
    volatility
  );

  console.log(
    "Momentum:",
    momentum
  );

  console.log(
    "Support:",
    supportLevel
  );

  console.log(
    "Resistance:",
    resistanceLevel
  );

  console.log(
    "=============================="
  );

  clearMarketData();

  return {
    trend,
    volatility,
    momentum,
    supportLevel,
    resistanceLevel
  };

};

module.exports = analyzeMarket;