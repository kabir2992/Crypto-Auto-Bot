const MCXPosition = require("../models/MCXPosition");

// ============================================================
// HELPERS
// ============================================================

const hasOpenLongPosition = async (userId, symbol) =>
{
    const count = await MCXPosition.countDocuments({
        userId,
        symbol,
        side:   "LONG",
        status: "OPEN"
    });

    return count > 0;
};

const hasOpenShortPosition = async (userId, symbol) =>
{
    const count = await MCXPosition.countDocuments({
        userId,
        symbol,
        side:   "SHORT",
        status: "OPEN"
    });

    return count > 0;
};

const hasMACDSignal = ({ latestMACD, latestSignal }) =>
{
    return (
        latestMACD   !== null &&
        latestMACD   !== undefined &&
        latestSignal !== null &&
        latestSignal !== undefined
    );
};

// ─── Vote logger (identical style to Binance) ────────────────

const logDecisionVotes = (strategyName, votes) =>
{
    const winner = Object.entries(votes).reduce(
        (highest, current) =>
            current[1] > highest[1] ? current : highest
    );

    console.log("========== DECISION VOTES ==========");
    console.log("Strategy    :", strategyName);
    console.log("LONG BUY    :", votes.LONG_BUY);
    console.log("LONG SELL   :", votes.LONG_SELL);
    console.log("SHORT SELL  :", votes.SHORT_SELL);
    console.log("SHORT CLOSE :", votes.SHORT_CLOSE);
    console.log("HOLD        :", votes.HOLD);
    console.log("Leading     :", winner[0]);
    console.log("====================================");

    return {
        strategyName,
        votes,
        leadingDecision: winner[0]
    };
};

// ─── Result builder ──────────────────────────────────────────

const createResult = ({ action, voteData }) =>
({
    action,
    strategyName:    voteData.strategyName,
    votes:           voteData.votes,
    leadingDecision: voteData.leadingDecision
});

// ============================================================
// STRATEGY 1 — MOMENTUM  (BULLISH market)
// Goal: ride the uptrend — LONG BUY on strength, LONG SELL
//       when momentum fades, SHORT on confirmed reversal
// ============================================================

const runMomentumStrategy = async ({
    userId,
    symbol,
    rsi,
    trend,
    momentum,
    ema20,
    ema50,
    latestMACD,
    latestSignal,
    volatility,
    adx,
    breakout,
    isBullishEngulfing,
    currentPrice,
    botState
}) => {

    let longBuyScore   = 0;
    let longSellScore  = 0;
    let shortSellScore = 0;
    let shortCloseScore= 0;

    const hasLong  = await hasOpenLongPosition(userId, symbol);
    const hasShort = await hasOpenShortPosition(userId, symbol);
    const hasMACD  = hasMACDSignal({ latestMACD, latestSignal });

    // ── LONG BUY conditions ──────────────────────────────

    if (rsi > 50 && rsi < 70)
    {
        longBuyScore += 2;
    }

    if (trend > 0.3)
    {
        longBuyScore += 2;
    }

    if (momentum > 0)
    {
        longBuyScore += 1;
    }

    if (ema20 > ema50)
    {
        longBuyScore += 2;
    }

    if (hasMACD && latestMACD > latestSignal)
    {
        longBuyScore += 2;
    }

    if (adx > 25)
    {
        longBuyScore += 1;
    }

    if (breakout)
    {
        longBuyScore += 2;
    }

    if (isBullishEngulfing)
    {
        longBuyScore += 1;
    }

    // ── LONG SELL conditions ─────────────────────────────

    if (rsi > 70)
    {
        longSellScore += 3;
    }

    if (hasMACD && latestMACD < latestSignal)
    {
        longSellScore += 3;
    }

    if (momentum <= 0)
    {
        longSellScore += 1;
    }

    if (trend < -0.3)
    {
        longSellScore += 2;
    }

    if (ema20 < ema50)
    {
        longSellScore += 2;
    }

    // ── HOLD score ───────────────────────────────────────

    const holdScore = Math.max(0, 8 - Math.max(longBuyScore, longSellScore));

    const voteData = logDecisionVotes("Momentum (Bullish)", {
        LONG_BUY:    longBuyScore,
        LONG_SELL:   longSellScore,
        SHORT_SELL:  shortSellScore,
        SHORT_CLOSE: shortCloseScore,
        HOLD:        holdScore
    });

    // ── Decision ─────────────────────────────────────────

    if (longBuyScore >= 7 && !hasLong && !hasShort)
    {
        botState.currentStrategy = "Momentum Long Buy";
        return createResult({ action: "LONG_BUY", voteData });
    }

    if (longSellScore >= 6 && hasLong)
    {
        botState.currentStrategy = "Momentum Long Sell";
        return createResult({ action: "LONG_SELL", voteData });
    }

    botState.currentStrategy = "Momentum Hold";
    return createResult({ action: "HOLD", voteData });
};

// ============================================================
// STRATEGY 2 — DEFENSIVE  (BEARISH market)
// Goal: profit from downtrend — SHORT SELL, close on bounce,
//       avoid LONG entries
// ============================================================

const runDefensiveStrategy = async ({
    userId,
    symbol,
    rsi,
    momentum,
    latestMACD,
    latestSignal,
    adx,
    breakdown,
    isBearishEngulfing,
    isHammer,
    currentPrice,
    supportLevel,
    botState
}) => {

    let shortSellScore  = 0;
    let shortCloseScore = 0;

    const hasShort = await hasOpenShortPosition(userId, symbol);
    const hasLong  = await hasOpenLongPosition(userId, symbol);
    const hasMACD  = hasMACDSignal({ latestMACD, latestSignal });

    // ── SHORT SELL conditions ────────────────────────────

    if (rsi < 45)
    {
        shortSellScore += 3;
    }

    if (hasMACD && latestMACD < latestSignal)
    {
        shortSellScore += 2;
    }

    if (momentum < 0)
    {
        shortSellScore += 2;
    }

    if (adx > 25)
    {
        shortSellScore += 1;
    }

    if (breakdown)
    {
        shortSellScore += 3;
    }

    if (isBearishEngulfing)
    {
        shortSellScore += 1;
    }

    // ── SHORT CLOSE conditions ───────────────────────────

    if (rsi < 30)
    {
        shortCloseScore += 3;
    }

    if (isHammer)
    {
        shortCloseScore += 2;
    }

    if (currentPrice <= supportLevel * 1.005)
    {
        shortCloseScore += 2;
    }

    if (momentum >= 0)
    {
        shortCloseScore += 1;
    }

    if (hasMACD && latestMACD > latestSignal)
    {
        shortCloseScore += 2;
    }

    const holdScore = Math.max(0, 5 - Math.max(shortSellScore, shortCloseScore));

    const voteData = logDecisionVotes("Defensive (Bearish)", {
        LONG_BUY:    0,
        LONG_SELL:   0,
        SHORT_SELL:  shortSellScore,
        SHORT_CLOSE: shortCloseScore,
        HOLD:        holdScore
    });

    // ── Decision ─────────────────────────────────────────

    // Close any open LONG first in a bearish market
    if (hasLong)
    {
        botState.currentStrategy = "Defensive Long Exit (bearish market)";
        return createResult({ action: "LONG_SELL", voteData });
    }

    if (shortSellScore >= 6 && !hasShort)
    {
        botState.currentStrategy = "Defensive Short Entry";
        return createResult({ action: "SHORT_SELL", voteData });
    }

    if (hasShort && shortCloseScore >= 5)
    {
        botState.currentStrategy = "Defensive Short Close";
        return createResult({ action: "SHORT_CLOSE", voteData });
    }

    botState.currentStrategy = "Defensive Hold";
    return createResult({ action: "HOLD", voteData });
};

// ============================================================
// STRATEGY 3 — MEAN REVERSION  (SIDEWAYS market)
// Goal: buy at support, sell at resistance — LONG only
// ============================================================

const runMeanReversionStrategy = async ({
    userId,
    symbol,
    rsi,
    currentPrice,
    supportLevel,
    resistanceLevel,
    volatility,
    bbLower,
    bbUpper,
    isHammer,
    isShootingStar,
    botState
}) => {

    let longBuyScore  = 0;
    let longSellScore = 0;

    const hasLong  = await hasOpenLongPosition(userId, symbol);
    const hasShort = await hasOpenShortPosition(userId, symbol);

    // ── LONG BUY conditions ──────────────────────────────

    if (rsi < 40)
    {
        longBuyScore += 3;
    }
    else if (rsi < 50)
    {
        longBuyScore += 1;
    }

    if (currentPrice <= supportLevel * 1.005)
    {
        longBuyScore += 3;
    }

    if (bbLower !== null && currentPrice <= bbLower)
    {
        longBuyScore += 2;
    }

    if (isHammer)
    {
        longBuyScore += 2;
    }

    if (volatility < 3)
    {
        longBuyScore += 1;
    }

    // ── LONG SELL conditions ─────────────────────────────

    if (rsi > 60)
    {
        longSellScore += 3;
    }
    else if (rsi > 50)
    {
        longSellScore += 1;
    }

    if (currentPrice >= resistanceLevel * 0.995)
    {
        longSellScore += 3;
    }

    if (bbUpper !== null && currentPrice >= bbUpper)
    {
        longSellScore += 2;
    }

    if (isShootingStar)
    {
        longSellScore += 2;
    }

    const holdScore = Math.max(0, 5 - Math.max(longBuyScore, longSellScore));

    const voteData = logDecisionVotes("Mean Reversion (Sideways)", {
        LONG_BUY:    longBuyScore,
        LONG_SELL:   longSellScore,
        SHORT_SELL:  0,
        SHORT_CLOSE: 0,
        HOLD:        holdScore
    });

    // ── Decision ─────────────────────────────────────────

    if (longBuyScore >= 6 && !hasLong && !hasShort)
    {
        botState.currentStrategy = "Mean Reversion Long Buy";
        return createResult({ action: "LONG_BUY", voteData });
    }

    if (longSellScore >= 6 && hasLong)
    {
        botState.currentStrategy = "Mean Reversion Long Sell";
        return createResult({ action: "LONG_SELL", voteData });
    }

    botState.currentStrategy = "Mean Reversion Hold";
    return createResult({ action: "HOLD", voteData });
};

// ============================================================
// STRATEGY 4 — GRID  (VOLATILE market)
// Goal: safety first — only trade on extreme moves,
//       hold in extreme volatility
// ============================================================

const runGridStrategy = async ({
    userId,
    symbol,
    rsi,
    currentPrice,
    supportLevel,
    resistanceLevel,
    volatility,
    ema20,
    ema50,
    latestMACD,
    latestSignal,
    botState
}) => {

    const hasLong  = await hasOpenLongPosition(userId, symbol);
    const hasShort = await hasOpenShortPosition(userId, symbol);
    const hasMACD  = hasMACDSignal({ latestMACD, latestSignal });

    // Safety: extreme volatility → full hold, protect capital
    if (volatility > 10)
    {
        const voteData = logDecisionVotes("Grid (Volatile) — Extreme Hold", {
            LONG_BUY:    0,
            LONG_SELL:   0,
            SHORT_SELL:  0,
            SHORT_CLOSE: 0,
            HOLD:        10
        });

        botState.currentStrategy = "Grid Extreme Volatility Hold";
        return createResult({ action: "HOLD", voteData });
    }

    let longBuyScore  = 0;
    let longSellScore = 0;

    // ── BUY at support ───────────────────────────────────

    if (currentPrice <= supportLevel * 1.005)
    {
        longBuyScore += 3;
    }

    if (rsi < 45)
    {
        longBuyScore += 2;
    }

    if (ema20 >= ema50)
    {
        longBuyScore += 2;
    }

    if (hasMACD && latestMACD >= latestSignal)
    {
        longBuyScore += 1;
    }

    // ── SELL at resistance ───────────────────────────────

    if (currentPrice >= resistanceLevel * 0.995)
    {
        longSellScore += 3;
    }

    if (rsi > 60)
    {
        longSellScore += 2;
    }

    const holdScore = Math.max(0, 6 - Math.max(longBuyScore, longSellScore));

    const voteData = logDecisionVotes("Grid (Volatile)", {
        LONG_BUY:    longBuyScore,
        LONG_SELL:   longSellScore,
        SHORT_SELL:  0,
        SHORT_CLOSE: 0,
        HOLD:        holdScore
    });

    // ── Decision ─────────────────────────────────────────

    if (longBuyScore >= 6 && !hasLong && !hasShort)
    {
        botState.currentStrategy = "Grid Long Buy";
        return createResult({ action: "LONG_BUY", voteData });
    }

    if (longSellScore >= 5 && hasLong)
    {
        botState.currentStrategy = "Grid Long Sell";
        return createResult({ action: "LONG_SELL", voteData });
    }

    botState.currentStrategy = "Grid Hold";
    return createResult({ action: "HOLD", voteData });
};

// ============================================================
// MAIN ENGINE
// Routes to the correct strategy based on market type
// ============================================================

const decideTrade = async (data) =>
{
    const { marketCondition, botState, userId, symbol } = data;

    if (!botState)
    {
        const voteData = logDecisionVotes("No BotState", {
            LONG_BUY: 0, LONG_SELL: 0,
            SHORT_SELL: 0, SHORT_CLOSE: 0, HOLD: 1
        });

        return createResult({ action: "HOLD", voteData });
    }

    console.log("Selected Market :", marketCondition);
    console.log("Strategy        :", {
        BULLISH:  "Momentum Strategy",
        BEARISH:  "Defensive Strategy",
        SIDEWAYS: "Mean Reversion Strategy",
        VOLATILE: "Grid Strategy"
    }[marketCondition] || "Unknown");

    switch (marketCondition)
    {
        case "BULLISH":
            return runMomentumStrategy(data);

        case "BEARISH":
            return runDefensiveStrategy(data);

        case "SIDEWAYS":
            return runMeanReversionStrategy(data);

        case "VOLATILE":
            return runGridStrategy(data);

        default:
        {
            const voteData = logDecisionVotes("Unknown Market", {
                LONG_BUY: 0, LONG_SELL: 0,
                SHORT_SELL: 0, SHORT_CLOSE: 0, HOLD: 1
            });

            botState.currentStrategy = "Unknown Market Hold";
            return createResult({ action: "HOLD", voteData });
        }
    }
};

module.exports = decideTrade;