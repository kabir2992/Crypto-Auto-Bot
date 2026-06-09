const User = require("../models/User");
const MCXBotState = require("../models/MCXBotState");
const UserSettings = require("../models/UserSettings");

// ========================================
// START BOT
// ========================================

const startBot = async (req, res) =>
{
    try
    {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                botEnabled: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "MCX Bot Started"
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
// STOP BOT
// ========================================

const stopBot = async (req, res) =>
{
    try
    {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                botEnabled: false
            }
        );

        return res.status(200).json({
            success: true,
            message: "MCX Bot Stopped"
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
// BOT STATUS
// ========================================

const getBotStatus = async (req, res) =>
{
    try
    {
        const user =
        await User.findById(req.user._id);

        const settings =
        await UserSettings.findOne({
            userId: req.user._id
        });

        const states =
        await MCXBotState.find({
            userId: req.user._id
        });

        return res.status(200).json({
            success: true,
            botEnabled: user.botEnabled,
            nextAnalysisTime: global.nextAnalysisTime ?? null,
            selectedCommodities:
                settings?.selectedCommodities || [],
            states
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
// DASHBOARD
// ========================================

const getDashboard = async (req, res) =>
{
    try
    {
        const states =
        await MCXBotState.find({
            userId: req.user._id
        });

        let totalProfit = 0;
        let totalLoss = 0;
        let realProfit = 0;
        let totalBalance = 0;

        states.forEach(state =>
        {
            totalProfit += state.totalProfit || 0;
            totalLoss += state.totalLoss || 0;
            realProfit += state.realTotalProfit || 0;
            totalBalance += state.availableBalance || 0;
        });

        return res.status(200).json({
            success: true,
            dashboard:
            {
                totalProfit,
                totalLoss,
                realProfit,
                totalBalance,
                commodities: states.length,
                states
            }
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
    startBot,
    stopBot,
    getBotStatus,
    getDashboard
};