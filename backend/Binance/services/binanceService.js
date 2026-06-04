// Market prices
// Orders
// Account balance
// Candlestick data

const { Spot } = require("@binance/connector");

const client = new Spot(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_SECRET_KEY,
  {
    baseURL: "https://api.binance.com"
  }
);

module.exports = client;