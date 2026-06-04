const express = require("express");
const router = express.Router();

const Trade = require("../models/Trade");

router.get("/", async (req, res) => {

  const trades = await Trade.find()
    .sort({ createdAt: -1 });

  res.json(trades);
});

module.exports = router;