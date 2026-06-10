const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://65.0.26.101",
    "http://65.0.26.101:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173"
  ],
  credentials: true,           // Important for cookies/auth
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Binance Auto Bot API Running"
  });
});

module.exports = app;