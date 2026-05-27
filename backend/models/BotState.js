const mongoose = require("mongoose");

const botStateSchema = new mongoose.Schema(
    {
        availableBalance: {
            type: Number,
            default: 1000
        },

        solHolding: {
            type: Number,
            default: 0
        },

        averageBuyPrice: {
            type: Number,
            default: 0
        },

        lastBuyPrice: {
            type: Number,
            default: 0
        },

        totalProfit: {
            type: Number,
            default: 0
        },

        realTotalProfit: {
            type: Number,
            default: 0
        },

        totalInvestedAmount: {
            type: Number,
            default: 0
        },

        totalBuyAmount: {
            type: Number,
            default: 0
        },

        totalSellAmount: {
            type: Number,
            default: 0
        },

        totalLoss: {
            type: Number,
            default: 0
        },

        lastAction: {
            type: String,
            enum: ["BUY", "SELL", "HOLD", "NONE", "INSUFFICIENT BALANCE"],
            default: "NONE"
        },

        nextAnalysisTime: {
            type: Date,
            default: null
        },

        botMode: {
            type: String,
            enum: ["WAITING", "ANALYZING", "BUYING", "HOLDING", "SELLING", "WARNING"],
            default: "WAITING"
        },

        currentStrategy: {
            type: String,
            default: "Market Observation"
        },

        highestPrice: {
            type: Number,
            default: 0
        },

        trailingStopPrice: {
            type: Number,
            default: 0
        },

        warningMessage: {
            type: String,
            default: ""
        },

        balanceWarning: {
            type: Boolean,
            default: false
        },

        minimumSellPrice: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    },
);

module.exports = mongoose.model("BotState", botStateSchema);
