const {
    EMA,
    RSI,
    MACD,
    ATR,
    ADX,
    BollingerBands
} = require("technicalindicators");

// ============================================================
// VWAP
// ============================================================

function calculateVWAP(candles)
{
    let cumulativeTPV    = 0;
    let cumulativeVolume = 0;

    for (const c of candles)
    {
        const typicalPrice = (c.high + c.low + c.close) / 3;
        cumulativeTPV    += typicalPrice * c.volume;
        cumulativeVolume += c.volume;
    }

    return cumulativeVolume > 0
        ? cumulativeTPV / cumulativeVolume
        : null;
}

// ============================================================
// SUPPORT & RESISTANCE  (last 20 candles, excluding current)
// ============================================================

function calculateSupportResistance(candles)
{
    const slice = candles.slice(-21, -1);

    const highs = slice.map(c => c.high);
    const lows  = slice.map(c => c.low);

    return {
        supportLevel:    Math.min(...lows),
        resistanceLevel: Math.max(...highs)
    };
}

// ============================================================
// TREND  (% change from first to last close in window)
// ============================================================

function calculateTrend(closes)
{
    if (closes.length < 2) return 0;

    const first = closes[0];
    const last  = closes[closes.length - 1];

    return ((last - first) / first) * 100;
}

// ============================================================
// MOMENTUM  (last price minus price 10 bars ago)
// ============================================================

function calculateMomentum(closes)
{
    if (closes.length < 10) return 0;

    return closes[closes.length - 1] - closes[closes.length - 10];
}

// ============================================================
// VOLATILITY  (% range over window)
// ============================================================

function calculateVolatility(candles)
{
    const highs = candles.map(c => c.high);
    const lows  = candles.map(c => c.low);

    const highest = Math.max(...highs);
    const lowest  = Math.min(...lows);

    return lowest > 0
        ? ((highest - lowest) / lowest) * 100
        : 0;
}

// ============================================================
// CANDLESTICK PATTERNS  (last candle)
// ============================================================

function detectPatterns(candles)
{
    const last = candles.at(-1);
    const prev = candles.at(-2);

    if (!last || !prev)
    {
        return {
            isBullishEngulfing: false,
            isBearishEngulfing: false,
            isDoji:             false,
            isHammer:           false,
            isShootingStar:     false
        };
    }

    const candleRange = last.high - last.low;
    const bodySize    = Math.abs(last.close - last.open);
    const lowerShadow = Math.min(last.open, last.close) - last.low;
    const upperShadow = last.high - Math.max(last.open, last.close);

    return {
        isBullishEngulfing:
            prev.close < prev.open &&
            last.close > last.open &&
            last.open  < prev.close &&
            last.close > prev.open,

        isBearishEngulfing:
            prev.close > prev.open &&
            last.close < last.open &&
            last.open  > prev.close &&
            last.close < prev.open,

        isDoji:
            candleRange > 0 &&
            bodySize <= candleRange * 0.1,

        isHammer:
            lowerShadow > bodySize * 2 &&
            upperShadow < bodySize,

        isShootingStar:
            upperShadow > bodySize * 2 &&
            lowerShadow < bodySize
    };
}

// ============================================================
// MARKET STRUCTURE  (higher highs / lower lows)
// ============================================================

function detectStructure(candles)
{
    const last = candles.at(-1);
    const prev = candles.at(-2);

    if (!last || !prev)
    {
        return {
            isHigherHigh: false,
            isHigherLow:  false,
            isLowerHigh:  false,
            isLowerLow:   false
        };
    }

    return {
        isHigherHigh: last.high > prev.high,
        isHigherLow:  last.low  > prev.low,
        isLowerHigh:  last.high < prev.high,
        isLowerLow:   last.low  < prev.low
    };
}

// ============================================================
// MAIN  —  returns a FLAT object (same style as Binance)
// Minimum 200 candles required
// ============================================================

function calculateIndicators(candles)
{
    if (!candles || candles.length < 200)
    {
        return null;
    }

    const closes  = candles.map(c => c.close);
    const highs   = candles.map(c => c.high);
    const lows    = candles.map(c => c.low);
    const volumes = candles.map(c => c.volume);

    // ─── Price ───────────────────────────────────────────
    const currentPrice  = closes.at(-1);
    const currentVolume = volumes.at(-1);
    const avgVolume     = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const volumeRatio   = avgVolume > 0 ? currentVolume / avgVolume : 0;

    // ─── EMA ─────────────────────────────────────────────
    const ema20 = EMA.calculate({ period: 20,  values: closes }).at(-1);
    const ema50 = EMA.calculate({ period: 50,  values: closes }).at(-1);
    const ema200= EMA.calculate({ period: 200, values: closes }).at(-1);

    // ─── RSI ─────────────────────────────────────────────
    const rsi = RSI.calculate({ period: 14, values: closes }).at(-1);

    // ─── MACD ────────────────────────────────────────────
    const macdRaw = MACD.calculate({
        values:              closes,
        fastPeriod:          12,
        slowPeriod:          26,
        signalPeriod:        9,
        SimpleMAOscillator:  false,
        SimpleMASignal:      false
    }).at(-1);

    const latestMACD    = macdRaw?.MACD      ?? null;
    const latestSignal  = macdRaw?.signal    ?? null;
    const latestHistogram = macdRaw?.histogram ?? null;

    // ─── ATR ─────────────────────────────────────────────
    const atr = ATR.calculate({
        high:   highs,
        low:    lows,
        close:  closes,
        period: 14
    }).at(-1);

    // ─── ADX ─────────────────────────────────────────────
    const adxRaw = ADX.calculate({
        high:   highs,
        low:    lows,
        close:  closes,
        period: 14
    }).at(-1);

    const adx = adxRaw?.adx ?? null;
    const pdi = adxRaw?.pdi ?? null;
    const mdi = adxRaw?.mdi ?? null;

    // ─── Bollinger Bands ─────────────────────────────────
    const bbRaw = BollingerBands.calculate({
        period: 20,
        values: closes,
        stdDev: 2
    }).at(-1);

    const bbUpper  = bbRaw?.upper  ?? null;
    const bbMiddle = bbRaw?.middle ?? null;
    const bbLower  = bbRaw?.lower  ?? null;
    const bbWidth  = bbRaw && currentPrice > 0
        ? (bbRaw.upper - bbRaw.lower) / currentPrice
        : null;

    // ─── VWAP ────────────────────────────────────────────
    const vwap = calculateVWAP(candles.slice(-50));

    // ─── Derived ─────────────────────────────────────────
    const { supportLevel, resistanceLevel } = calculateSupportResistance(candles);
    const trend      = calculateTrend(closes);
    const momentum   = calculateMomentum(closes);
    const volatility = calculateVolatility(candles);

    // Breakout / breakdown vs last 20 candle highs/lows
    const recentHigh = Math.max(...highs.slice(-21, -1));
    const recentLow  = Math.min(...lows.slice(-21, -1));
    const breakout   = currentPrice > recentHigh;
    const breakdown  = currentPrice < recentLow;

    // ─── Patterns & Structure ────────────────────────────
    const patterns  = detectPatterns(candles);
    const structure = detectStructure(candles);

    // ─── ATR-based SL / TP ───────────────────────────────
    const atrMultiplierSL = 1.5;
    const atrMultiplierTP = 3.0;

    const longSL  = atr ? currentPrice - atr * atrMultiplierSL : null;
    const longTP  = atr ? currentPrice + atr * atrMultiplierTP : null;
    const shortSL = atr ? currentPrice + atr * atrMultiplierSL : null;
    const shortTP = atr ? currentPrice - atr * atrMultiplierTP : null;

    // ─── Return flat object ──────────────────────────────
    return {
        // Price
        currentPrice,
        currentVolume,
        avgVolume,
        volumeRatio,

        // EMA
        ema20,
        ema50,
        ema200,

        // RSI
        rsi,

        // MACD
        latestMACD,
        latestSignal,
        latestHistogram,

        // ATR / ADX
        atr,
        adx,
        pdi,
        mdi,

        // Bollinger
        bbUpper,
        bbMiddle,
        bbLower,
        bbWidth,

        // VWAP
        vwap,

        // Levels
        supportLevel,
        resistanceLevel,
        recentHigh,
        recentLow,

        // Derived
        trend,
        momentum,
        volatility,
        breakout,
        breakdown,

        // Candlestick patterns
        ...patterns,

        // Market structure
        ...structure,

        // ATR-based SL/TP (pre-calculated at entry price)
        longSL,
        longTP,
        shortSL,
        shortTP
    };
}

module.exports = { calculateIndicators };