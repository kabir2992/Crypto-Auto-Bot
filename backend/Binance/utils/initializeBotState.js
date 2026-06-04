const BotState = require("../models/BotState");

const initializeBotState = async () => {

  const existingState =
    await BotState.findOne();

  if (!existingState) {

    await BotState.create({
      availableBalance: process.env.HOLDING_USD,
      solHolding: 0,
      averageBuyPrice: 0,
      totalProfit: 0,
      lastAction: "NONE"
    });

    console.log(
      "Initial Bot State Created"
    );

  }

};

module.exports = initializeBotState;