const UserSettings = require("../models/UserSettings");

// ========================================
// GET SETTINGS
// ========================================

const getSettings = async (req, res) =>
{
    try
    {
        let settings =
        await UserSettings.findOne({
            userId: req.user._id
        });

        if (!settings)
        {
            settings =
            await UserSettings.create({
                userId: req.user._id
            });
        }

        return res.status(200).json({
            success: true,
            data: settings
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
// UPDATE SETTINGS
// ========================================

const updateSettings = async (req, res) =>
{
    try
    {
        const settings =
        await UserSettings.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $set: req.body
            },
            {
                new: true,
                upsert: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Settings Updated",
            data: settings
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
    getSettings,
    updateSettings
};