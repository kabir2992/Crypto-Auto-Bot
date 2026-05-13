const client = require("../services/binanceService");
const { calculateEMA, calculateRSI } = require("../services/indicatorService");

const getChartData = async(req, res) => {
    try{
        const candles = await client.klines(
            "SOLUSDT",
            "1m",
            {
                limit: 60
            }
        );

        const closes = candles.data.map( candle =>
            parseFloat(candle[4])
        );
        const ema20 = calculateEMA(closes, 20);
        const ema50 = calculateEMA(closes, 50);
        const rsiPeriod = 14;
        const rawRSI = calculateRSI(closes);
        const rsiValues = [ ...Array(rsiPeriod).fill(null), ...rawRSI ];

        const formatted = candles.data.map( (candle, index) => {
            const originalTime = Number(candle[0]);

            if (!Number.isFinite(originalTime)) {
                throw new Error(`Invalid candle open time: ${JSON.stringify(candle)}`);
            }

            return {
                // time: new Date(originalTime)
                // .toLocaleTimeString([],{
                //     hour: "2-digit",
                //     minute: "2-digit"
                // }),
                originalTime,
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
                ema20: ema20[index],
                ema50: ema50[index],
                rsi: rsiValues[index] ?? null
            };
        });
        
        res.json(formatted);
    }

    catch(err)
    {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { getChartData };