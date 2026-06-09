// ============================================================
// MCX MARKET CONDITION ENGINE
// Votes on market type using indicators.
// Returns: BULLISH | BEARISH | SIDEWAYS | VOLATILE
// ============================================================

function determineMarketCondition(indicators)
{
    const {
        ema20,
        ema50,
        ema200,
        rsi,
        latestMACD,
        latestSignal,
        latestHistogram,
        adx,
        atr,
        bbWidth,
        vwap,
        currentPrice,
        volatility,
        trend,
        momentum,
        volumeRatio,
        breakout,
        breakdown,
        isHigherHigh,
        isHigherLow,
        isLowerHigh,
        isLowerLow,
        isBullishEngulfing,
        isBearishEngulfing,
        isHammer,
        isShootingStar,
        isDoji
    } = indicators;

    // ─── Score Buckets ───────────────────────────────────
    let bullish  = 0;
    let bearish  = 0;
    let sideways = 0;
    let volatile = 0;

    const reasons = [];

    // ─── EMA Short-Term Trend ────────────────────────────

    if (ema20 > ema50)
    {
        bullish += 2;
        reasons.push("EMA20 above EMA50");
    }
    else
    {
        bearish += 2;
        reasons.push("EMA20 below EMA50");
    }

    // ─── EMA Long-Term Trend ─────────────────────────────

    if (ema50 > ema200)
    {
        bullish += 2;
        reasons.push("EMA50 above EMA200");
    }
    else
    {
        bearish += 2;
        reasons.push("EMA50 below EMA200");
    }

    // ─── EMA Convergence (sideways signal) ───────────────

    if (Math.abs(ema20 - ema50) / ema50 < 0.003)
    {
        sideways += 2;
        reasons.push("EMA20 and EMA50 converging");
    }

    // ─── RSI ─────────────────────────────────────────────

    if (rsi > 60)
    {
        bullish += 2;
        reasons.push("RSI bullish zone (>" + rsi.toFixed(1) + ")");
    }
    else if (rsi < 40)
    {
        bearish += 2;
        reasons.push("RSI bearish zone (<" + rsi.toFixed(1) + ")");
    }
    else
    {
        sideways += 2;
        reasons.push("RSI neutral zone (" + rsi.toFixed(1) + ")");
    }

    // ─── MACD ────────────────────────────────────────────

    if (latestMACD !== null && latestSignal !== null)
    {
        if (latestHistogram > 0)
        {
            bullish += 2;
            reasons.push("MACD histogram positive");
        }
        else
        {
            bearish += 2;
            reasons.push("MACD histogram negative");
        }
    }

    // ─── ADX (trend strength) ────────────────────────────

    if (adx !== null)
    {
        if (adx >= 25)
        {
            bullish += 1;
            bearish += 1;
            reasons.push("Strong trend ADX (" + adx.toFixed(1) + ")");
        }
        else
        {
            sideways += 3;
            reasons.push("Weak trend ADX (" + adx.toFixed(1) + ") → sideways");
        }
    }

    // ─── ATR Volatility ──────────────────────────────────

    if (atr !== null && currentPrice > 0)
    {
        const atrPct = (atr / currentPrice) * 100;

        if (atrPct > 1.5)
        {
            volatile += 3;
            reasons.push("High ATR volatility (" + atrPct.toFixed(2) + "%)");
        }
    }

    // ─── Bollinger Band Width ─────────────────────────────

    if (bbWidth !== null)
    {
        if (bbWidth > 0.05)
        {
            volatile += 2;
            reasons.push("BB expanding (" + (bbWidth * 100).toFixed(2) + "%)");
        }
        else if (bbWidth < 0.01)
        {
            sideways += 2;
            reasons.push("BB squeeze → low volatility");
        }
    }

    // ─── VWAP ────────────────────────────────────────────

    if (vwap !== null)
    {
        if (currentPrice > vwap)
        {
            bullish += 2;
            reasons.push("Price above VWAP");
        }
        else
        {
            bearish += 2;
            reasons.push("Price below VWAP");
        }
    }

    // ─── Trend % ─────────────────────────────────────────

    if (trend > 0.5)
    {
        bullish += 2;
        reasons.push("Uptrend (" + trend.toFixed(2) + "%)");
    }
    else if (trend < -0.5)
    {
        bearish += 2;
        reasons.push("Downtrend (" + trend.toFixed(2) + "%)");
    }
    else
    {
        sideways += 1;
        reasons.push("Flat trend (" + trend.toFixed(2) + "%)");
    }

    // ─── Momentum ────────────────────────────────────────

    if (momentum > 0)
    {
        bullish += 1;
        reasons.push("Positive momentum");
    }
    else if (momentum < 0)
    {
        bearish += 1;
        reasons.push("Negative momentum");
    }

    // ─── Volume Ratio ────────────────────────────────────

    if (volumeRatio >= 2)
    {
        volatile += 2;
        bullish  += 1;
        bearish  += 1;
        reasons.push("Volume surge (" + volumeRatio.toFixed(2) + "x avg)");
    }

    // ─── Breakout / Breakdown ────────────────────────────

    if (breakout)
    {
        bullish += 3;
        reasons.push("Price breakout above 20-bar high");
    }

    if (breakdown)
    {
        bearish += 3;
        reasons.push("Price breakdown below 20-bar low");
    }

    // ─── Market Structure ────────────────────────────────

    if (isHigherHigh && isHigherLow)
    {
        bullish += 2;
        reasons.push("Higher high + higher low structure");
    }

    if (isLowerHigh && isLowerLow)
    {
        bearish += 2;
        reasons.push("Lower high + lower low structure");
    }

    // ─── Candlestick Patterns ────────────────────────────

    if (isBullishEngulfing)
    {
        bullish += 2;
        reasons.push("Bullish engulfing candle");
    }

    if (isBearishEngulfing)
    {
        bearish += 2;
        reasons.push("Bearish engulfing candle");
    }

    if (isHammer)
    {
        bullish += 2;
        reasons.push("Hammer candle detected");
    }

    if (isShootingStar)
    {
        bearish += 2;
        reasons.push("Shooting star candle detected");
    }

    if (isDoji)
    {
        sideways += 2;
        reasons.push("Doji candle → indecision");
    }

    // ─── Final Scores ─────────────────────────────────────

    const scores = { BULLISH: bullish, BEARISH: bearish, SIDEWAYS: sideways, VOLATILE: volatile };

    const max = Math.max(bullish, bearish, sideways, volatile);

    let marketCondition = "SIDEWAYS";

    if      (max === bullish  && bullish  > 0) marketCondition = "BULLISH";
    else if (max === bearish  && bearish  > 0) marketCondition = "BEARISH";
    else if (max === volatile && volatile > 0) marketCondition = "VOLATILE";

    const totalScore = bullish + bearish + sideways + volatile;
    const confidence = totalScore > 0
        ? ((max / totalScore) * 100).toFixed(2)
        : "0.00";

    const strategyMap = {
        BULLISH:  "Momentum Strategy",
        BEARISH:  "Defensive Strategy",
        SIDEWAYS: "Mean Reversion Strategy",
        VOLATILE: "Grid Strategy"
    };

    return {
        marketCondition,
        confidence: Number(confidence),
        scores,
        strategyUsed: strategyMap[marketCondition],
        reasons
    };
}

module.exports = { determineMarketCondition };