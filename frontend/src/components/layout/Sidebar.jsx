import {
  LayoutDashboard, CandlestickChart, BrainCircuit,
  History, Wallet, MonitorSmartphone,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const navItems = [
    { name: "Dashboard",      path: "/",                icon: LayoutDashboard  },
    { name: "Charts",         path: "/charts",          icon: CandlestickChart },
    { name: "AI Analytics",   path: "/ai-analytics",    icon: BrainCircuit     },
    { name: "Trade History",  path: "/trade-history",   icon: History          },
    { name: "Money",          path: "/money-management",icon: Wallet           },
    { name: "Mini Dashboard", path: "/mini-dashboard",  icon: MonitorSmartphone},
  ];

  return (
    // ✅ h-full — stretches to whatever the parent gives it
    <aside className={`
      h-full w-full z-40
      transition-all duration-300
      border-r border-slate-200 dark:border-white/10
      bg-white dark:bg-[#020617]
      backdrop-blur-xl
      flex flex-col
    `}>

      {/* TOP LOGO */}
      <div className="h-[72px] flex items-center justify-between px-5 border-b border-slate-200 dark:border-white/10 flex-shrink-0">

        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <span className="text-white font-black text-lg">₿</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h2 className="text-base font-black text-slate-900 dark:text-white whitespace-nowrap">
                Crypto AI BOT
              </h2>
              <p className="text-xs text-slate-400 whitespace-nowrap">Quantum Trading</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all shrink-0"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* NAVIGATION — scrolls if too many items */}
      <nav className="flex-1 overflow-y-auto py-5 px-3">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => `
                  group relative flex items-center gap-4
                  rounded-2xl px-3 py-3.5
                  transition-all duration-200 overflow-hidden
                  ${isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-400/20 text-cyan-400 dark:text-cyan-300 shadow-lg shadow-cyan-500/10"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && (
                  <span className="font-semibold whitespace-nowrap text-sm">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* FOOTER */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-white/10 p-3">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/10 p-3">
          {sidebarOpen ? (
            <>
              <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-sm font-bold text-green-400">LIVE TRADING</p>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;