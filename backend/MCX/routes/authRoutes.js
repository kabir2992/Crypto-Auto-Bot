const express =
require("express");

const router =
express.Router();

const {
    signup,
    login,
    logout,
    getProfile
} =
require("../controller/authController");

const authMiddleware =
require("../middleware/authMiddleware");

router.post(
    "/signup",
    signup
);

router.post(
    "/login",
    login
);

router.post(
    "/logout",
    authMiddleware,
    logout
);

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

module.exports =
router;