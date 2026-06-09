const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    getBotStatus,
    startBot,
    stopBot
} =
require("../controller/botController");

router.get(
    "/state",
    authMiddleware,
    getBotStatus
);

router.post(
    "/enable",
    authMiddleware,
    startBot
);

router.post(
    "/disable",
    authMiddleware,
    stopBot
);

module.exports =
router;