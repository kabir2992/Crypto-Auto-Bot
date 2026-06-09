const crypto = require("crypto");

const generateTradeId = (symbol) =>
{
    const timestamp = Date.now();

    const random =
    crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `${symbol}-${timestamp}-${random}`;
};

module.exports =
{
    generateTradeId
};