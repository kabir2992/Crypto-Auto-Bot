const {
    registerUser,
    loginUser,
    logoutUser
} =
require("../services/authService");

const signup =
async (req, res) =>
{
    try
    {
        const {
            firstName,
            lastName,
            email,
            password,
            phone
        } = req.body;

        const user =
        await registerUser({
            firstName,
            lastName,
            email,
            password,
            phone
        });

        return res.status(201).json({
            success: true,
            message:
            "User registered successfully",
            user:
            {
                id: user._id,
                firstName:
                user.firstName,
                email:
                user.email
            }
        });
    }
    catch (error)
    {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login =
async (req, res) =>
{
    try
    {
        const {
            email,
            password
        } = req.body;

        const {
            user,
            token
        } =
        await loginUser(
            email,
            password
        );

        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure:
                process.env.NODE_ENV ===
                "production",
                sameSite: "strict",
                maxAge:
                7 *
                24 *
                60 *
                60 *
                1000
            }
        );

        return res.status(200).json({
            success: true,
            message:
            "Login successful",
            user:
            {
                id: user._id,
                firstName:
                user.firstName,
                lastName:
                user.lastName,
                email:
                user.email,
                role:
                user.role,
                subscriptionPlan:
                user.subscriptionPlan
            }
        });
    }
    catch (error)
    {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const logout =
async (req, res) =>
{
    try
    {
        await logoutUser(
            req.user._id
        );

        res.clearCookie(
            "token"
        );

        return res.status(200).json({
            success: true,
            message:
            "Logout successful"
        });
    }
    catch (error)
    {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getProfile =
async (req, res) =>
{
    try
    {
        return res.status(200).json({
            success: true,
            user: req.user
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
    signup,
    login,
    logout,
    getProfile
};