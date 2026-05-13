const http = require("http");
const { Server } = require("socket.io");

const startPriceSocket = require("./services/socketService");

const app = require("./app");
const connectDB = require("./config/db");
require("./cron/tradingCron");
const initializeBotState = require("./utils/initializeBotState");

require("dotenv").config();

// Test Routes
const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

// Bot Routes
const botRoutes = require("./routes/botRoutes");
app.use("/api/bot", botRoutes);

// Trade Routes
const tradeRoutes = require("./routes/tradeRoutes");
app.use("/api/trades", tradeRoutes);

// Chart Route
const chartRoutes = require("./routes/chartRoutes");
app.use("/api/chart", chartRoutes);

const server = http.createServer(app);

// Create Socket Server
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Socket Connection
io.on("connection", (socket) => {

  console.log("Client Connected");

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });

});

// Start Price Socket
startPriceSocket(io);

// Make io globally available
app.set("io", io);

// Database Connection
const PORT = process.env.PORT;
connectDB();

initializeBotState();
// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});