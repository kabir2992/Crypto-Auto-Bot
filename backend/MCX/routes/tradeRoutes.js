const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    getOpenPositions,
    getTradeHistory,
    getTradeById
} =
require("../controller/tradeController");

router.get(
    "/positions",
    authMiddleware,
    getOpenPositions
);

router.get(
    "/history",
    authMiddleware,
    getTradeHistory
);

router.get(
    "/:id",
    authMiddleware,
    getTradeById
);

module.exports =
router;