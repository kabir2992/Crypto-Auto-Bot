const {
  RSI,
  EMA,
  SMA,
  MACD,
  ATR,
  ADX,
  BollingerBands,
  StochasticRSI,
  CCI,
  WilliamsR
} = require("technicalindicators");

function calculateIndicators(candles) {
  if (candles.length < 50) return null;

  const close = candles.map(c => c.close);
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);

  return {
    rsi: RSI.calculate({
      values: close,
      period: 14
    }),

    ema20: EMA.calculate({
      values: close,
      period: 20
    }),

    ema50: EMA.calculate({
      values: close,
      period: 50
    }),

    sma200: SMA.calculate({
      values: close,
      period: 200
    }),

    macd: MACD.calculate({
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }),

    atr: ATR.calculate({
      high,
      low,
      close,
      period: 14
    }),

    adx: ADX.calculate({
      high,
      low,
      close,
      period: 14
    }),

    bb: BollingerBands.calculate({
      values: close,
      period: 20,
      stdDev: 2
    }),

    stochRsi: StochasticRSI.calculate({
      values: close,
      rsiPeriod: 14,
      stochasticPeriod: 14,
      kPeriod: 3,
      dPeriod: 3
    }),

    cci: CCI.calculate({
      high,
      low,
      close,
      period: 20
    }),

    williamsR: WilliamsR.calculate({
      high,
      low,
      close,
      period: 14
    })
  };
}

module.exports = {
  calculateIndicators
};