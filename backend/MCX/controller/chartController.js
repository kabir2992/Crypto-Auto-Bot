const { getCandles } =
require("../marketData/candleAggregator");

const {
    calculateIndicators
} =
require("../core/indicators");

const getChartData =
async (req, res) =>
{
    try
    {
        const symbol =
        req.params.symbol;

        const candles =
        getCandles(
            symbol,
            200
        );

        if (
            !candles ||
            candles.length < 50
        )
        {
            return res.status(400).json({
                success: false,
                message:
                "Not enough candle data"
            });
        }

        const indicators =
        calculateIndicators(
            candles
        );

        const formatted =
        candles.map(
            (
                candle,
                index
            ) =>
            ({
                time:
                candle.startTime,

                open:
                candle.open,

                high:
                candle.high,

                low:
                candle.low,

                close:
                candle.close,

                volume:
                candle.volume,

                ema20:
                indicators.ema20[index] ??
                null,

                ema50:
                indicators.ema50[index] ??
                null,

                ema200:
                indicators.sma200[index] ??
                null,

                rsi:
                indicators.rsi[index] ??
                null,

                atr:
                indicators.atr[index] ??
                null,

                adx:
                indicators.adx[index]?.adx ??
                null,

                macd:
                indicators.macd[index]?.MACD ??
                null,

                signal:
                indicators.macd[index]?.signal ??
                null,

                histogram:
                indicators.macd[index]?.histogram ??
                null,

                bbUpper:
                indicators.bb[index]?.upper ??
                null,

                bbMiddle:
                indicators.bb[index]?.middle ??
                null,

                bbLower:
                indicators.bb[index]?.lower ??
                null
            })
        );

        return res.json({
            success: true,
            symbol,
            count:
            formatted.length,
            data:
            formatted
        });
    }
    catch (error)
    {
        return res.status(500).json({
            success: false,
            message:
            error.message
        });
    }
};

module.exports =
{
    getChartData
};