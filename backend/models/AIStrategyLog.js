const mongoose = require("mongoose");

const aiStrategyLogSchema = new mongoose.Schema({

  coin: {
    type: String,
    default: "SOLUSDT"
  },

  decision: {
    type: String,
    enum: ["BUY", "SELL", "HOLD"],
    required: true
  },

  strategyName: {
    type: String,
    required: true
  },

  confidence: {
    type: Number,
    required: true
  },

  reason: {
    type: [String],
    default: []
  },

  entryPrice: Number,

  currentPrice: Number,

  stopLoss: Number,

  takeProfit: Number,

  investment: Number,

  holdings: Number,

  pnl: Number,

  tradeResult: {
    type: String,
    default: "PENDING"
  },

  marketTrend: String,

  summary: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "AIStrategyLog",
  aiStrategyLogSchema
);