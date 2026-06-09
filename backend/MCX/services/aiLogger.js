const MCXAIStrategyLog =
require("../models/MCXAIStrategyLog");

module.exports =
async (data) =>
{
    await MCXAIStrategyLog.create(data);
};