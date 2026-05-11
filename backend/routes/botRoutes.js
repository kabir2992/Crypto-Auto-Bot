const express = require("express");
const router = express.Router();

const BotState = require("../models/BotState");

router.get("/status", async (req, res) => {

  const botState = await BotState.findOne();

  res.json(botState);
});

module.exports = router;