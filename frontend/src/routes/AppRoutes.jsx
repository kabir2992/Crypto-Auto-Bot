import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout
from "../layouts/MainLayout";

// PAGES

import Dashboard
from "../pages/Dashboard";

import Charts
from "../pages/Charts";

import AIAnalytics
from "../pages/AIAnalytics";

import TradeHistory
from "../pages/TradeHistory";

import MoneyManagement
from "../pages/MoneyManagement";

const AppRoutes = () => {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<MainLayout />}
        >

          <Route
            index
            element={
              <Navigate
                to="/dashboard"
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/charts"
            element={<Charts />}
          />

          <Route
            path="/ai-analytics"
            element={<AIAnalytics />}
          />

          <Route
            path="/trade-history"
            element={<TradeHistory />}
          />

          <Route
            path="/money"
            element={<MoneyManagement />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

};

export default AppRoutes;