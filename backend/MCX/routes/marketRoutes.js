const express = require("express");
const router = express.Router();
const { getAllCommodities, getCommodityPrice, getSymbols } = require("../controller/marketController");

// Public endpoint - no auth needed for live prices
router.get("/all", getAllCommodities);
router.get("/symbols", getSymbols);
router.get("/:symbol", getCommodityPrice);

module.exports = router;