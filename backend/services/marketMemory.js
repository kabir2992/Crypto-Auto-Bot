let marketData = [];

// =========================
// STORE MARKET DATA
// =========================

const addMarketData = (price) => {

  marketData.push({ price, timestamp: new Date() });

  // Keep last 200 entries only
  if (marketData.length > 200)
  {
    marketData.shift();
  }

};

// =========================
// GET MARKET DATA
// =========================

const getMarketData = () => { return marketData; };

// =========================
// CLEAR MARKET DATA
// =========================

const clearMarketData = () => { marketData = []; };

// =========================
// MARKET ANALYSIS ENGINE
// ONLY DETECTS MARKET TYPE
// =========================

const analyzeMarketCondition = ({ rsi, ema20, ema50, macd, volatility, trend, momentum }) => {

  // =====================
  // MARKET SCORES
  // =====================

  let bullishScore = 0;

  let bearishScore = 0;

  let sidewaysScore = 0;

  let volatileScore = 0;

  // =====================
  // EMA ANALYSIS
  // =====================

  if (ema20 > ema50)
  {
    bullishScore += 2;
  }
  else
  {
    bearishScore += 2;
  }

  // EMA close together
  if ( Math.abs( ema20 - ema50 ) < 0.3 )
  {
    sidewaysScore += 2;
  }

  // =====================
  // RSI ANALYSIS
  // =====================

  if (rsi > 55)
  {
    bullishScore += 2;
  }

  if (rsi < 45)
  {
    bearishScore += 2;
  }

  if ( rsi >= 45 && rsi <= 55 )
  {
    sidewaysScore += 2;
  }

  // =====================
  // TREND ANALYSIS
  // =====================

  if (trend > 0.5)
  {
    bullishScore += 2;
  }

  if (trend < -0.5)
  {
    bearishScore += 2;
  }

  if ( trend > -0.3 && trend < 0.3 )
  {
    sidewaysScore += 2;
  }

  // =====================
  // VOLATILITY ANALYSIS
  // =====================

  if (volatility > 4)
  {
    volatileScore += 3;
  }

  if (volatility < 1.5)
  {
    sidewaysScore += 2;
  }

  // =====================
  // MOMENTUM ANALYSIS
  // =====================

  if (momentum > 0)
  {
    bullishScore += 1;
  }

  if (momentum < 0)
  {
    bearishScore += 1;
  }

  // =====================
  // MACD ANALYSIS
  // =====================

  if (macd > 0)
  {
    bullishScore += 2;
  }

  if (macd < 0)
  {
    bearishScore += 2;
  }

  // =====================
  // FINAL MARKET SCORES
  // =====================

  const marketScores = {

    BULLISH: bullishScore,

    BEARISH: bearishScore,

    SIDEWAYS: sidewaysScore,

    VOLATILE: volatileScore

  };

  // =====================
  // DETECT MARKET TYPE
  // =====================

  let marketType = "SIDEWAYS";

  let highestScore = 0;

  for (const type in marketScores)
  {

    if ( marketScores[type] > highestScore )
    {
      highestScore = marketScores[type];

      marketType = type;
    }

  }

  // =====================
  // CONFIDENCE
  // =====================

  const totalScore = bullishScore + bearishScore + sidewaysScore + volatileScore;

  const confidence = totalScore > 0 ? ( ( highestScore / totalScore ) * 100 ).toFixed(2) : 0;

  const strategyMap = {
    BULLISH: "Momentum Strategy",
    BEARISH: "Defensive Strategy",
    SIDEWAYS: "Mean Reversion Strategy",
    VOLATILE: "Grid Strategy"
  };

  // =====================
  // RETURN
  // =====================

  return { marketType, confidence, marketScores, votes: marketScores, strategyUsed: strategyMap[marketType] };

};

module.exports = { addMarketData, getMarketData, clearMarketData, analyzeMarketCondition };