const mongoose = require("mongoose");

// ============================================================
// MCX CANDLE MODEL
// Stores completed 5-min candles persistently in MongoDB
// so on server restart we load from DB instead of Angel One
// ============================================================

const MCXCandleSchema = new mongoose.Schema(
{
    symbol:    { type: String, required: true },  // fullSymbol e.g. GOLDM26JULFUT
    timestamp: { type: Number, required: true },  // candle open time in ms
    open:      { type: Number, required: true },
    high:      { type: Number, required: true },
    low:       { type: Number, required: true },
    close:     { type: Number, required: true },
    volume:    { type: Number, default: 0 }
},
{
    timestamps: false  // we manage time ourselves via timestamp field
});

// Compound unique index — one candle per symbol per 5-min window
MCXCandleSchema.index(
    { symbol: 1, timestamp: 1 },
    { unique: true }
);

// Index for fast symbol queries sorted by time
MCXCandleSchema.index({ symbol: 1, timestamp: -1 });

module.exports = mongoose.model("MCXCandle", MCXCandleSchema);