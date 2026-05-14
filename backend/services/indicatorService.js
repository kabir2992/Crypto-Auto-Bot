// Calculates technical indicators through:-
// RSI

const { RSI, MACD } = require("technicalindicators");

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

const calculateMACD = (closes) => {
  const macdValues = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

  const latestMACDData = macdValues[macdValues.length  - 1];

  if (!latestMACDData) {
    return {
      macd: null,
      signal: null,
      histogram: null
    };
  }

  return {
    macd: latestMACDData.MACD,
    signal: latestMACDData.signal,
    histogram: latestMACDData.histogram
  };
};

module.exports = { calculateRSI, calculateEMA, calculateMACD };
