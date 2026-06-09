const mongoose = require("mongoose");

const User = require("../models/User");
const MCXBotState = require("../models/MCXBotState");
const MCXSettings = require("../models/UserSettings");
const commodityConfig = require("../config/commodityConfig");

async function initializeMCX() {
  try {
    console.log("🚀 Initializing MCX System...");

    // =========================
    // CHECK OR CREATE USER
    // =========================
    let user = await User.findOne({ email: "test@mcx.com" });

    if (!user) {
      user = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "test@mcx.com",
        password: "test123", // hash later in production
        isActive: true,
        botEnabled: true
      });

      console.log("✅ Test User Created");
    }

    const userId = user._id;

    // =========================
    // CREATE SETTINGS IF NOT EXISTS
    // =========================
    let settings = await MCXSettings.findOne({ userId });

    if (!settings) {
      settings = await MCXSettings.create({
        userId,
        selectedCommodities: Object.keys(commodityConfig),
        defaultLots: 1,
        maxLotsPerTrade: 5,
        allowLongTrades: true,
        allowShortTrades: true,
        aiTradingEnabled: false, // keep AI OFF (as per your requirement)
        maxOpenPositions: 10,
        maxMarginUsagePercent: 80,
        dailyLossLimitPercent: 15,
        autoCompound: false,
        tradingInterval: "5m",
        notifications: {
          email: true,
          tradeExecuted: true,
          tradeClosed: true,
          lowBalance: true,
          dailySummary: true
        }
      });

      console.log("✅ Default MCX Settings Created");
    }

    // =========================
    // INITIALIZE BOT STATE FOR EACH COMMODITY
    // =========================
    const commodities = settings.selectedCommodities;

    for (const commodity of commodities) {
      let botState = await MCXBotState.findOne({
        userId,
        commodity
      });

      if (!botState) {
        await MCXBotState.create({
          userId,
          commodity,
          availableBalance: 100000,
          holdings: 0,
          averageBuyPrice: 0,
          totalProfit: 0,
          totalLoss: 0,
          realTotalProfit: 0,
          totalInvestedAmount: 0,
          totalBuyAmount: 0,
          totalSellAmount: 0,
          highestPrice: 0,
          trailingStopPrice: 0,
          minimumSellPrice: 0,
          currentStrategy: "Observation",
          marketType: "UNKNOWN",
          botMode: "WAITING",
          lastAction: "NONE",
          warningMessage: "",
          balanceWarning: false,
          nextAnalysisTime: null
        });

        console.log(`✅ BotState Created for ${commodity}`);
      }
    }

    console.log("🔥 MCX INITIALIZATION COMPLETE");

  } 
catch (error) {
    console.log("❌ MCX Init Error:", error.message);
  }
}

module.exports = initializeMCX;