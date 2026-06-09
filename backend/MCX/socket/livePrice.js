const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
const speakeasy = require("speakeasy");
const axios = require("axios");
const { updateMarketData } = require("../marketData/marketDataManager");
const { onPriceTick } = require("../core/priceFeed");
const extractCommodity = require("../utils/extractCommoditiy");

function getMCXEnv() {
  const totpSecret =
    process.env.MCX_TOTP_SECRET ||
    process.env.MCX_SECRET_KEY;

  return {
    apiKey: process.env.MCX_API_KEY,
    clientId: process.env.MCX_CLIENT_ID,
    password: process.env.MCX_PASSWORD,
    totpSecret
  };
}

function getLoginErrorMessage(session) {
  return (
    session?.message ||
    session?.error ||
    session?.data?.message ||
    "Angle One login failed: no session data returned"
  );
}

async function startLiveFeed() {
  const {
    apiKey,
    clientId,
    password,
    totpSecret
  } = getMCXEnv();

  const subscribedSymbols = [];

  if (
    !apiKey ||
    !totpSecret ||
    !clientId ||
    !password
  ) {
    console.log("⚠️ MCX live feed skipped: missing Angle One credentials");
    return null;
  }

  const api = new SmartAPI({ api_key: apiKey });

  const totp = speakeasy.totp({
    secret: totpSecret,
    encoding: "base32"
  });

  const session = await api.generateSession(clientId, password, totp);

  if (!session?.data?.feedToken || !session?.data?.jwtToken) {
    const message = getLoginErrorMessage(session);
    throw new Error(message);
  }

  const feedToken = session.data.feedToken;
  console.log("✅ Logged in!");

  const instruments = await axios.get(
    "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
  );

  const mcxFutures = instruments.data.filter(
    i => i.exch_seg === "MCX" && i.instrumenttype === "FUTCOM"
  );

  subscribedSymbols.length = 0;

  mcxFutures.forEach(item => {
    subscribedSymbols.push(item.symbol);
  });

  const tokenMap = {};
  mcxFutures.forEach(i => {
    const token = String(i.token).trim();
    const baseSymbol = extractCommodity(i.symbol);
    tokenMap[token] = {
      fullSymbol: i.symbol,
      baseSymbol
    };
  });

  const allTokens = mcxFutures.map(i => i.token);

  global.mcxSymbols = subscribedSymbols;

  console.log(`📦 Subscribing to ${allTokens.length} MCX futures...`);

	  const ws = new WebSocketV2({
	    jwttoken: session.data.jwtToken,
	    apikey: apiKey,
	    clientcode: clientId,
	    feedtype: feedToken,
	  });

  ws.connect().then(() => {
    console.log("✅ WebSocket connected!");

    ws.fetchData({
      correlationID: "mcx_all",
      action: 1,       // 1 = subscribe
      mode: 1,         // 1 = LTP only
      exchangeType: 5, // 5 = MCX
      tokens: allTokens
    });

    ws.on("tick", (data) => {
      if (!data.last_traded_price || !data.token) return;

      const token = String(data.token).replace(/"/g, "").trim();
      const instrument = tokenMap[token];
      if (!instrument)
      {
        return;
      }

      const price = Number(data.last_traded_price) / 100;
      const volume = Number(data.volume_traded_today || 0);

      updateMarketData(instrument.fullSymbol, price, volume);
      onPriceTick(instrument.fullSymbol, price, volume);
      // console.log(`📈 ${instrument.fullSymbol} -> ${instrument.fullSymbol} -> ₹${price}`);

      const time = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
      // console.log(`📈 ${instrument.baseSymbol} | ₹${price} | ${time}`);
    });

  }).catch((err) => {
    console.error("❌ Connection error:", err.message);
  });

  ws.on("error", (err) => console.error("❌ WS Error:", err));
  ws.on("close", () => console.log("🔌 WebSocket closed"));
  return ws;
}

const getAllSubscribedSymbols = () => {
  return global.mcxSymbols || [];
}

module.exports = { startLiveFeed, getAllSubscribedSymbols };
