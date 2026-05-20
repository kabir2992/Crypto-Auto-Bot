# Backend (Trading Bot Server)

Node.js/Express backend that:
- Pulls SOLUSDT market data from Binance
- Computes technical indicators (RSI/EMA/MACD)
- Determines trade actions using strategy logic (`strategyEngine`)
- Executes trades via a Binance service (`tradeService`)
- Runs a periodic cron job to keep evaluating and trading
- Exposes REST endpoints and WebSocket updates for the dashboard

## Key Runtime Entry Points

- **`server.js` / `app.js`**
  - Creates the Express server
  - Registers API routes
  - Sets up middleware (CORS, JSON body parsing)
  - Starts HTTP/WebSocket services

- **`cron/tradingCron.js`**
  - Scheduled every 5 minutes (`node-cron`)
  - Flow:
    1. Loads `BotState`
    2. Fetches candles from Binance
    3. Calculates indicators
    4. Calls `analyzeMarketCondition` to classify market state
    5. Calls `strategyEngine` to get `action` (BUY/SELL/HOLD) and strategy vote details
    6. Optionally calls AI decision endpoints
    7. Executes `executeBuy` / `executeSell` based on the action
    8. Updates `BotState` mode and last action

## Strategy Engine

- **`bot/strategyEngine.js`**
  - Contains scoring-based strategies.
  - Strategies return a structured result including:
    - `action`: `BUY` | `SELL` | `HOLD`
    - `strategyVotes`: numeric vote scores `{ BUY, SELL, HOLD }`
    - `votesForFusion`: normalized values for vote fusion
  - Strategies implemented:
    - Mean Reversion (`runMeanReversion`)
    - Momentum (`runMomentumStrategy`)
    - Defensive / Bearish (`runDefensiveStrategy`)
    - Grid / Volatile (`runGridStrategy`)
  - Also includes global risk exits (e.g., trailing stop and profit protection).

## Core Services

- **`services/binanceService.js`**
  - Binance API wrapper (klines/price, etc.)

- **`services/indicatorService.js`**
  - Technical indicator calculations: RSI, EMA, MACD

- **`services/analysisService.js`**
  - Market analysis helpers used to derive trend/volatility/momentum

- **`services/marketMemory.js`**
  - Maintains/derives memory of market conditions and classifies `marketType`

- **`services/tradeService.js`**
  - Executes actual buy/sell logic (Binance orders)

- **`services/aiContextBuilder.js`**
  - Builds input context for the AI layer (candles/indicators/recent trades)

- **`services/aiDecisionService.js`**
  - Calls the AI decision API/model

- **`services/decisionFusionService.js`**
  - Combines AI output and strategy votes into a final fused decision

## Models (MongoDB / Mongoose)

- **`models/BotState.js`**
  - Persists bot balances, holdings, trailing stop price, and current mode

- **`models/Trade.js`**
  - Persists trade history

- **`models/AIStrategyLog.js`**
  - Persists AI + strategy logs (useful for debugging and analytics)

## Routes

- **`routes/aiRoutes.js`**
  - AI-related REST endpoints

- **`routes/tradeRoutes.js`**
  - Trade history / trade controls

- **`routes/botRoutes.js`**
  - Bot state endpoints

- **`routes/chartRoutes.js` / `controllers/chartController.js`**
  - Chart data endpoints (for dashboard)

## How to Run

1. Install dependencies:
   - `cd backend && npm install`
2. Create `.env` (Binance keys + Mongo connection + AI config)
3. Start server:
   - `npx nodemon server.js`
4. The cron job will automatically begin running `cron/tradingCron.js`.
