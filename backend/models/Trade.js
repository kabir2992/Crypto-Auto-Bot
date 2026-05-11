const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      default: "SOLUSDT"
    },

    side: {
      type: String,
      enum: ["BUY", "SELL"]
    },

    quantity: Number,

    price: Number,

    profit: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      default: "COMPLETED"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Trade", tradeSchema);