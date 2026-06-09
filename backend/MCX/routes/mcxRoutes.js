const express = require("express");

const router = express.Router();

const {
    getLivePrice,
    getCandles,
    testIndicators,
    testMarketCondition,
    testStrategy,
    testBuy,
    testSell
}
= require("../controller/mcxController");

router.get("/live-price/:symbol", getLivePrice);

router.get("/candles/:symbol", getCandles);

router.get("/indicators/:symbol", testIndicators);

router.get("/market-condition/:symbol", testMarketCondition);

router.get("/strategy/:symbol", testStrategy);

router.post("/buy/:symbol", testBuy);

router.post("/sell/:symbol", testSell);

module.exports = router;
