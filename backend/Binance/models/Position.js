const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
{
    symbol:
    {
        type: String,
        default: "SOLUSDT"
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
        enum: ["OPEN", "CLOSED", "EXECUTED"],
        default: "OPEN"
    },

    quantity:
    {
        type: Number,
        required: true
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

    stopLoss:
    {
        type: Number,
        default: 0
    },

    takeProfit:
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

    margin:
    {
        type: Number,
        default: 0
    },

    leverage:
    {
        type: Number,
        default: 1
    },

    closedAt:
    {
        type: Date,
        default: null
    }
},
{
    timestamps: true
});

module.exports = mongoose.model( "Position", positionSchema );