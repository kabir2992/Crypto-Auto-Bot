const { addTick } = require("../marketData/candleAggregator");

function onPriceTick(baseSymbol, price, volume) {
    addTick(baseSymbol, price, volume);
}

module.exports = { onPriceTick };