require("dotenv").config();

const http        = require("http");
const { Server }  = require("socket.io");
const cookieParser = require("cookie-parser");

const app        = require("./app");
const connectDB  = require("./Binance/config/db");

// ─── Binance ─────────────────────────────────────────────────
const startPriceSocket  = require("./Binance/services/socketService");
const initializeBotState = require("./Binance/utils/initializeBotState");
require("./Binance/cron/tradingCron");

// ─── MCX ─────────────────────────────────────────────────────
const initializeMCX = require("./MCX/utils/initializerMCX");
const { startLiveFeed }      = require("./MCX/socket/livePrice");
const { bootstrapCandles }   = require("./MCX/utils/historicalCandleBootstrap");
const { startTradingCron }   = require("./MCX/cron/tradingCron");

// ============================================================
// BINANCE ROUTES
// ============================================================

const testRoutes  = require("./Binance/routes/testRoutes");
const botRoutes   = require("./Binance/routes/botRoutes");
const tradeRoutes = require("./Binance/routes/tradeRoutes");
const chartRoutes = require("./Binance/routes/chartRoutes");
const upload      = require("./Binance/routes/uploadRoutes");
const ai          = require("./Binance/routes/aiRoutes");

app.use("/api/test",   testRoutes);
app.use("/api/bot",    botRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/chart",  chartRoutes);
app.use("/api",        upload);
app.use("/api/ai",     ai);

// ============================================================
// MCX ROUTES
// ============================================================

const mcxAuthRoutes    = require("./MCX/routes/authRoutes");
const mcxBotRoutes     = require("./MCX/routes/botRoutes");
const mcxChartRoutes   = require("./MCX/routes/chartRoutes");
const mcxTradeRoutes   = require("./MCX/routes/tradeRoutes");
const mcxSettingRoutes = require("./MCX/routes/userSettingRoutes");

app.use("/api/auth",      mcxAuthRoutes);
app.use("/api/mcxbot",    mcxBotRoutes);
app.use("/api/mcxchart",  mcxChartRoutes);
app.use("/api/mcxtrade",  mcxTradeRoutes);
app.use("/api/setting",   mcxSettingRoutes);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cookieParser());

// ============================================================
// HTTP + SOCKET SERVER
// ============================================================

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) =>
{
    console.log("Client Connected");
    socket.on("disconnect", () => console.log("Client Disconnected"));
});

app.set("io", io);

// ============================================================
// STARTUP
// ============================================================

const PORT = process.env.PORT;

const startServer = async () =>
{
    // 1. Database
    await connectDB();

    // 2. Binance bot state
    await initializeBotState();
    await initializeMCX();

    // 3. MCX — bootstrap historical candles so indicators
    //    have data before the first cron fires
    await bootstrapCandles();

    // 4. Start HTTP server
    server.listen(PORT, () =>
    {
        console.log(`\n🚀 Server running on port ${PORT}`);
    });

    // 5. Binance WebSocket price feed
    startPriceSocket(io);

    // 6. MCX AngleOne live feed
    startLiveFeed().catch((err) =>
    {
        console.log("⚠️  MCX live feed error:", err.message);
        console.log("   Bot will still run on bootstrapped candles.");
    });

    // 7. MCX trading cron (every 5 min)
    startTradingCron();
};

startServer().catch((err) =>
{
    console.log("❌ Server startup error:", err.message);
    process.exit(1);
});