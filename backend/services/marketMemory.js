let marketData = [];

const addMarketData = (price) => {

  marketData.push({
    price,
    timestamp: new Date()
  });

};

const getMarketData = () => {
  return marketData;
};

const clearMarketData = () => {
  marketData = [];
};

module.exports = {
  addMarketData,
  getMarketData,
  clearMarketData
};