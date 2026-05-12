// Calculates technical indicators through:-
// RSI

const { RSI } = require("technicalindicators");

const calculateRSI = (closes) => {
  return RSI.calculate({
    values: closes,
    period: 14
  });
};

const calculateEMA = (prices, period) => {
  const multiplier = 2 / (period + 1);

  let ema = prices[0];

  const emaValues = [];

  for (let i = 0; i < prices.length; i++)
  {
    ema = ( prices[i] - ema ) * multiplier + ema;
    emaValues.push(ema);
  }

  return emaValues;
};

module.exports = { calculateRSI, calculateEMA };