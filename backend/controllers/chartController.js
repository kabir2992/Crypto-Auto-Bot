const client = require("../services/binanceService");

const getChartData = async(req, res) => {
    try{
        const candles = await client.klines(
            "SOLUSDT",
            "1m",
            {
                limit: 60
            }
        );

        const formatted = candles.data.map( candle => {
            const originalTime = Number(candle[0]);

            if (!Number.isFinite(originalTime)) {
                throw new Error(`Invalid candle open time: ${JSON.stringify(candle)}`);
            }

            return {
                time: new Date(originalTime)
                .toLocaleTimeString([],{
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                // originalTime,
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4])
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