const marketData = {};

function updateMarketData(
    symbol,
    price,
    volume = 0
)
{
    if (!marketData[symbol])
    {
        marketData[symbol] =
        {
            symbol,
            price,
            volume,
            high: price,
            low: price,
            updatedAt: new Date()
        };

        return;
    }

    const existing =
        marketData[symbol];

    existing.price = price;
    existing.volume = volume;

    existing.high =
        Math.max(
            existing.high,
            price
        );

    existing.low =
        Math.min(
            existing.low,
            price
        );

    existing.updatedAt =
        new Date();
}

function getMarketData(symbol)
{
    return marketData[symbol] || null;
}

function getCurrentPrice(symbol)
{
    return marketData[symbol]?.price || 0;
}

function getAllMarketData()
{
    return marketData;
}

module.exports =
{
    updateMarketData,
    getMarketData,
    getCurrentPrice,
    getAllMarketData
};