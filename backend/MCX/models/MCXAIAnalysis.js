const mongoose = require("mongoose");

const mcxAIAnalysisSchema = new mongoose.Schema({
    symbol: String,

    aiDecision: String,

    confidence: Number,

    strategy: String,

    reasoning:
    {
        type: [String],
        default: []
    }
},
{
    timestamps: true
});

module.exports = mongoose.model( "MCXAIAnalysis", mcxAIAnalysisSchema );