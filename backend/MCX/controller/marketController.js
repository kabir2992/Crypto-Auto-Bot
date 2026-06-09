const { getAllMarketData, getMarketData } = require("../marketData/marketDataManager");

/**
 * GET ALL COMMODITIES LIVE
 */
const getAllCommodities = async (req, res) => {
  try {
    const data = getAllMarketData();

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * GET ALL COMMODITIES SYMBOL
 */
const getSymbols = (req, res) => {
    try {
        const data = getAllMarketData();
        console.log("[mcx:getSymbols] data type:", data?.constructor?.name, "isNull:", data === null);
        const safeData = data || {};
        let symbols  = Object.keys(safeData);

        if (symbols.length === 0) {
            symbols = global.mcxSymbols || [];
        }

        console.log("Live data symbols:", symbols.length);
        console.log("Global symbols:", global.mcxSymbols?.length);

        return res.status(200).json({
            success: true,
            symbols,
            data,
            message: "Yooo I'm firing"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
            symbols: []
        });
    }
};

/**
 * SINGLE SYMBOL LIVE PRICE
 */
const getCommodityPrice = async (req, res) => {
  try {
    const { symbol } = req.params;

    const data = getMarketData(symbol);

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getAllCommodities,
  getCommodityPrice,
  getSymbols
};