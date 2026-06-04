const WebSocket = require("ws");
const { addMarketData } = require("./marketMemory");

const startPriceSocket = (io) => {

  const ws = new WebSocket(
    "wss://stream.binance.com:9443/ws/solusdt@trade"
  );

  ws.on("open", () => {
    console.log( "Connected to Binance WebSocket" );
  });

  ws.on("message", (data) => {

    const parsedData =
      JSON.parse(data);

    const livePrice =
      parseFloat(parsedData.p);

      // Store Makret Memory for Analysis
      addMarketData(livePrice);

    // Emit to frontend
    io.emit("livePrice", {
      symbol: "SOLUSDT",
      price: livePrice
    });

  });

  ws.on("close", () => {
    console.log(
      "Binance WebSocket Closed"
    );
  });

};

module.exports = startPriceSocket;