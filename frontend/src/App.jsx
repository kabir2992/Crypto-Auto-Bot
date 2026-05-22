import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Dashboard from "./pages/Dashboard";

import MiniDashboard from "./pages/MiniDashboard";

import AIAnalytics from "./pages/AIAnalytics";

import Chart from "./pages/Chart";

import MoneyManagement from "./pages/MoneyManagement";

import TradeHistory from "./pages/TradeHistory";

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