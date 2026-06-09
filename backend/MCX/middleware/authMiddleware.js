const User =
require("../models/User");

const {
    verifyToken
} =
require("../utils/jwt");

const authMiddleware =
async (
    req,
    res,
    next
) =>
{
    try
    {
        const token =
            req.cookies?.token ||
            req.headers.authorization ||
            req.query?.token
                ?.replace(
                    "Bearer ",
                    ""
                );

        if (!token)
        {
            return res.status(401).json({
                success: false,
                message: "Authentication requireddd",
                token: token
            });
        }

        const decoded = verifyToken(token);

        const user = await User.findById( decoded.id ).select("-password");

        if (!user)
        {
            return res
            .status(401)
            .json({
                success: false,
                message:
                "User not found"
            });
        }

        if (!user.isActive)
        {
            return res
            .status(403)
            .json({
                success: false,
                message:
                "Account disabled"
            });
        }

        req.user = user;

        next();
    }
    catch (error)
    {
        return res
        .status(401)
        .json({
            success: false,
            message:
            "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports =
authMiddleware;