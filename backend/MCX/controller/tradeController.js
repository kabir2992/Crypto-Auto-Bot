const MCXTrade = require("../models/MCXTrade");

// ========================================
// OPEN POSITIONS
// ========================================

const getOpenPositions = async (req, res) =>
{
    try
    {
        const trades =
        await MCXTrade.find({
            userId: req.user._id,
            status: "OPEN"
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: trades.length,
            data: trades
        });
    }
    catch (error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ========================================
// TRADE HISTORY
// ========================================

const getTradeHistory = async (req, res) =>
{
    try
    {
        const trades =
        await MCXTrade.find({
            userId: req.user._id
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: trades.length,
            data: trades
        });
    }
    catch (error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ========================================
// SINGLE TRADE
// ========================================

const getTradeById = async (req, res) =>
{
    try
    {
        const trade =
        await MCXTrade.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!trade)
        {
            return res.status(404).json({
                success: false,
                message: "Trade Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            data: trade
        });
    }
    catch (error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports =
{
    getOpenPositions,
    getTradeHistory,
    getTradeById
};