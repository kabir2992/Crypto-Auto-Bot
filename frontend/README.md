# Frontend (Dashboard)

React + Vite UI that displays:
- Current bot/trading state
- Market charts (via Lightweight Charts and Recharts)
- Strategy information / votes
- Trade table and analytics
- Live updates via Socket.IO

## Key Entry Points

- **`src/main.jsx`**
  - Mounts the React app

- **`src/App.jsx`**
  - Top-level routing/layout

- **`src/pages/Dashboard.jsx`**
  - Main dashboard view

- **`src/pages/MiniDashboard.jsx`**
  - Smaller dashboard variant

## Components

- **`src/components/MarketChart.jsx`**
  - Renders the trading market chart

- **`src/components/TradeTable.jsx`**
  - Shows trade history

- **`src/components/StrategyBadge.jsx`**
  - Displays selected strategy / action status

- **`src/components/StatCard.jsx`**
  - Small KPI widgets

- **`src/components/BotStatus.jsx`**
  - Shows bot mode (ANALYZING/BUYING/SELLING/HOLDING etc.)

- **`src/components/AnalysisTimer.jsx`**
  - Shows countdown/next analysis time

## Client Services

- **`src/services/socket.js`**
  - Socket.IO client setup for real-time bot updates

- **`src/api/axios.js`**
  - Axios instance configured for backend API calls

## Build / Run

1. Install dependencies:
   - `cd frontend && npm install`
2. Start dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
