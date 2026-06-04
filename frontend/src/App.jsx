import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Dashboard from "./Binance/pages/Dashboard";

import MiniDashboard from "./Binance/pages/MiniDashboard";

import AIAnalytics from "./Binance/pages/AIAnalytics";

import Chart from "./Binance/pages/Chart";

import MoneyManagement from "./Binance/pages/MoneyManagement";

import TradeHistory from "./Binance/pages/TradeHistory";

import MCXDashboard from "./MCX/pages/Dashboard";

function AnimatedRoutes() {

  const location = useLocation();

  return (

    <AnimatePresence
      mode="wait"
    >

      <Routes
        location={location}
        key={location.pathname}
      >

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/charts"
          element={<Chart />}
        />

        <Route
          path="/ai-analytics"
          element={<AIAnalytics />}
        />

        <Route
          path="/money-management"
          element={<MoneyManagement />}
        />

        <Route
          path="/trade-history"
          element={<TradeHistory />}
        />

        <Route
          path="/mini-dashboard"
          element={<MiniDashboard />}
        />

        <Route
          path="/mcx"
          element={<MCXDashboard />}
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </AnimatePresence>

  );

}

function App() {

  return (

    <BrowserRouter>

      <AnimatedRoutes />

    </BrowserRouter>

  );

}

export default App;