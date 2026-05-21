import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import AIAnalytics from "./pages/AIAnalytics";
import MoneyManagement from "./pages/MoneyManagement";
import TradeHistory from "./pages/TradeHistory";
import MiniDashboard from "./pages/MiniDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
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
          path="/money"
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

      </Routes>

    </BrowserRouter>

  );

}

export default App;