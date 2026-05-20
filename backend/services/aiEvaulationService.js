const AIStrategyLog = require("../models/AIStrategyLog");
const { getCandles } = require("./binanceService");

const aiEvaulationService = async () => {
    try {
        const pendingLogs = await AIStrategyLog.findOne({ actualOutcome: "PENDING" }).limit(20);

        for (const log of pendingLogs)
        {
            const candles = await getCandles("SOLDUDST", "5m", 1);
            const latestPrice = candles[candles.length - 1].close;

            let result = "FAILED";
            let profit = 0;

            if (log.decision === "BUY")
            {
                profit = (( latestPrice - log.entryPrice ) / log.entryPrice) * 100;
                result = profit > 0 ? "SUCCESS" : "FAILED";
            }

            if (log.decision === "SELL")
            {
                profit = (( log.entryPrice - latestPrice ) / log.entryPrice) * 100;
                result = profit > 0 ? "SUCCESS" : "FAILED";
            }

            if (log.decision === "HOLD")
            {
                result = "NEUTRAL";
            }

            log.futurePrice = latestPrice;
            log.profitIfExecuted = profit.toFixed(2);
            log.actualOutcome = result;
            log.evaluatedAt = new Date();
            await log.save();
            console.log( `✅ AI Strategy Evaluated: ${log.strategyName}` );
        }
    }
    catch (err)
    {
        console.log("❌ AI Evaluation Error:", err.message);
    }
}

module.exports = aiEvaulationService;