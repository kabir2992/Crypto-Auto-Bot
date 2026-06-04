import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  History,
  Wallet,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const itemClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-500/20 transition";

  return (
    <div className="h-screen w-64 fixed left-0 top-0 bg-gradient-to-b from-orange-950 via-black to-black text-white border-r border-orange-500/20">
      
      <div className="p-5 text-xl font-bold flex items-center gap-2">
        🪙 MCX AI Bot
      </div>

      <nav className="mt-6 space-y-2 px-3">

        <NavLink to="/" className={itemClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/charts" className={itemClass}>
          <BarChart3 size={18} /> Charts
        </NavLink>

        <NavLink to="/ai" className={itemClass}>
          <Brain size={18} /> AI Analytics
        </NavLink>

        <NavLink to="/history" className={itemClass}>
          <History size={18} /> Trade History
        </NavLink>

        <NavLink to="/wallet" className={itemClass}>
          <Wallet size={18} /> Wallet
        </NavLink>

        <NavLink to="/settings" className={itemClass}>
          <Settings size={18} /> Settings
        </NavLink>

        <NavLink to="/" className={itemClass}>
          <Settings size={18} /> Crypto Dashboard
        </NavLink>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition mt-10">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="absolute bottom-4 left-4 text-xs text-green-400">
        ● SYSTEM LIVE TRADING
      </div>
    </div>
  );
}