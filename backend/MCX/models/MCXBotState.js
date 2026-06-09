const mongoose = require("mongoose");

const mcxBotStateSchema =
new mongoose.Schema(
{
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    commodity:
    {
        type: String,
        required: true
    },

    availableBalance:
    {
        type: Number,
        default: 100000
    },

    holdings:
    {
        type: Number,
        default: 0
    },

    averageBuyPrice:
    {
        type: Number,
        default: 0
    },

    lastBuyPrice:
    {
        type: Number,
        default: 0
    },

    totalProfit:
    {
        type: Number,
        default: 0
    },

    totalLoss:
    {
        type: Number,
        default: 0
    },

    realTotalProfit:
    {
        type: Number,
        default: 0
    },

    totalInvestedAmount:
    {
        type: Number,
        default: 0
    },

    totalBuyAmount:
    {
        type: Number,
        default: 0
    },

    totalSellAmount:
    {
        type: Number,
        default: 0
    },

    highestPrice:
    {
        type: Number,
        default: 0
    },

    trailingStopPrice:
    {
        type: Number,
        default: 0
    },

    minimumSellPrice:
    {
        type: Number,
        default: 0
    },

    currentStrategy:
    {
        type: String,
        default: "Observation"
    },

    marketType:
    {
        type: String,
        default: "UNKNOWN"
    },

    botMode:
    {
        type: String,
        enum:
        [
            "WAITING",
            "ANALYZING",
            "LONG BUYING",
            "LONG SELLING",
            "SHORT SELLING",
            "SHORT CLOSING",
            "HOLDING",
            "WARNING"
        ],
        default: "WAITING"
    },

    lastAction:
    {
        type: String,
        default: "NONE"
    },

    warningMessage:
    {
        type: String,
        default: ""
    },

    balanceWarning:
    {
        type: Boolean,
        default: false
    },

    nextAnalysisTime:
    {
        type: Date,
        default: null
    }
},
{
    timestamps: true
});

mcxBotStateSchema.index(
{
    userId: 1,
    commodity: 1
},
{
    unique: true
});

module.exports =
mongoose.model(
    "MCXBotState",
    mcxBotStateSchema
);