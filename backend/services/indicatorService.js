const { RSI } = require("technicalindicators");

const calculateRSI = (closes) => {
  return RSI.calculate({
    values: closes,
    period: 14
  });
};

module.exports = { calculateRSI };

// Calculates technical indicators through:-
// RSI