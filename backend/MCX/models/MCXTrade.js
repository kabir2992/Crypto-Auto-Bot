const mongoose = require("mongoose");

const mcxTradeSchema =
new mongoose.Schema(
{
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    symbol:
    {
        type: String,
        required: true
    },

    tradeId:
    {
        type: String,
        required: true,
        unique: true
    },

    side:
    {
        type: String,
        enum:
        [
            "LONG_BUY",
            "LONG_SELL",
            "SHORT_SELL",
            "SHORT_CLOSE"
        ],
        required: true
    },

    positionSide:
    {
        type: String,
        enum:
        [
            "LONG",
            "SHORT"
        ],
        required: true
    },

    lots:
    {
        type: Number,
        default: 1
    },

    quantity:
    {
        type: Number,
        required: true
    },

    price:
    {
        type: Number,
        required: true
    },

    entryPrice:
    {
        type: Number,
        default: 0
    },

    exitPrice:
    {
        type: Number,
        default: 0
    },

    strategy:
    {
        type: String,
        default: "Unknown"
    },

    aiConfidence:
    {
        type: Number,
        default: 0
    },

    profit:
    {
        type: Number,
        default: 0
    },

    status:
    {
        type: String,
        enum:
        [
            "OPEN",
            "CLOSED"
        ],
        default: "OPEN"
    },

    closedAt:
    {
        type: Date,
        default: null
    },

    stopLoss:
    {
        type: Number,
        require: true,
        default: 0
    },

    targetPrice:
    {
        type: Number,
        require: true,
        default: 0
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model(
    "MCXTrade",
    mcxTradeSchema
);