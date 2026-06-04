const express = require("express");
const router = express.Router();

const client = require("../services/binanceService");
const test = require("../services/test");

router.get("/price", async (req, res) => {
  try {
    const response = await client.tickerPrice("SOLUSDT");

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// router.get("/angel", test);

module.exports = router;