const mongoose = require("mongoose");

const mcxPositionSchema =
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
        enum: ["LONG", "SHORT"],
        required: true
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

    quantity:
    {
        type: Number,
        required: true
    },

    lots:
    {
        type: Number,
        default: 1
    },

    entryPrice:
    {
        type: Number,
        required: true
    },

    exitPrice:
    {
        type: Number,
        default: 0
    },

    profit:
    {
        type: Number,
        default: 0
    },

    strategy:
    {
        type: String,
        default: "Unknown"
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
    "MCXPosition",
    mcxPositionSchema
);