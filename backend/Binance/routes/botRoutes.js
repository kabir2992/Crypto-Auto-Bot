const express = require("express");
const router = express.Router();
const BotState = require("../models/BotState");

// GET /api/bot/status
router.get("/status", async (req, res) => {
  try {
    const botState = await BotState.findOne();
    res.json(botState);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add-balance", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Please enter a valid amount greater than 0." });
    }

    const parsedAmount = Number(amount);

    // Find the single botState doc and increment availableBalance
    const updated = await BotState.findOneAndUpdate(
      {},
      {
        $inc: { availableBalance: parsedAmount },
        // Auto-clear balance warning if new balance >= 10
        $set: {
          balanceWarning: false,
          warningMessage: ""
        }
      },
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Bot state not found." });
    }

    // Re-check if still below threshold after adding
    if (updated.availableBalance < 10) {
      await BotState.findOneAndUpdate(
        {},
        {
          balanceWarning: true,
          warningMessage: "Balance still below $10. Please add more funds."
        }
      );
    }

    res.status(200).json({
      success: true,
      addedAmount: parsedAmount,
      availableBalance: updated.availableBalance,
      balanceWarning: updated.availableBalance < 10
    });

  } catch (err) {
    console.log("Add Balance Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;