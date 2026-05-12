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

        totalProfit: {
            type: Number,
            default: 0
        },

        lastAction: {
            type: String,
            enum: ["BUY", "SELL", "HOLD", "NONE"],
            default: "NONE"
        },

        nextAnalysisTime: {
            type: Date,
            default: null
        },

        botMode: {
            type: String,
            enum: [ "WAITING", "ANALYZING", "BUYING", "HOLDING", "SELLING" ],
            default: "WAITING"
        },

        currentStrategy: {
            type: String,
            default: "Market Observation"
        },
    },
    {
        timestamps: true
    },
);

module.exports = mongoose.model("BotState", botStateSchema);