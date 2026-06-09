const express =
require("express");

const router =
express.Router();

const {
    getChartData
} =
require("../controller/chartController");

router.get(
    "/:symbol",
    getChartData
);

module.exports =
router;