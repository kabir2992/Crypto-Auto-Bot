import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MiniDashboard from "./pages/MiniDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mini-dashboard" element={<MiniDashboard />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;