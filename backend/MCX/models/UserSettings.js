const mongoose = require("mongoose");

const userSettingsSchema =
new mongoose.Schema(
{
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    selectedCommodities:
    {
        type: [String]
    },

    defaultLots:
    {
        type: Number,
        default: 1
    },

    maxLotsPerTrade:
    {
        type: Number,
        default: 5
    },

    allowLongTrades:
    {
        type: Boolean,
        default: true
    },

    allowShortTrades:
    {
        type: Boolean,
        default: true
    },

    aiTradingEnabled:
    {
        type: Boolean,
        default: true
    },

    maxOpenPositions:
    {
        type: Number,
        default: 20
    },

    maxMarginUsagePercent:
    {
        type: Number,
        default: 80
    },

    dailyLossLimitPercent:
    {
        type: Number,
        default: 15
    },

    autoCompound:
    {
        type: Boolean,
        default: false
    },

    tradingInterval:
    {
        type: String,
        enum:
        [
            "1m",
            "5m",
            "15m",
            "30m",
            "1h"
        ],
        default: "5m"
    },

    notifications:
    {
        email:
        {
            type: Boolean,
            default: true
        },

        tradeExecuted:
        {
            type: Boolean,
            default: true
        },

        tradeClosed:
        {
            type: Boolean,
            default: true
        },

        lowBalance:
        {
            type: Boolean,
            default: true
        },

        dailySummary:
        {
            type: Boolean,
            default: true
        }
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model(
    "UserSettings",
    userSettingsSchema
);