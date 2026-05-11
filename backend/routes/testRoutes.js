const express = require("express");
const router = express.Router();

const client = require("../services/binanceService");

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

module.exports = router;