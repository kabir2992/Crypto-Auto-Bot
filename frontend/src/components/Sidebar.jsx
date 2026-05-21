import {
  LayoutDashboard,
  LineChart,
  Brain,
  Wallet,
  History,
  Monitor
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    name: "Charts",
    path: "/charts",
    icon: LineChart
  },
  {
    name: "AI Analytics",
    path: "/ai-analytics",
    icon: Brain
  },
  {
    name: "Money",
    path: "/money",
    icon: Wallet
  },
  {
    name: "Trade History",
    path: "/trade-history",
    icon: History
  },
  {
    name: "Mini Dashboard",
    path: "/mini-dashboard",
    icon: Monitor
  }
];

const Sidebar = () => {

  return (

    <div className="
      fixed left-0 top-0
      h-screen w-[270px]
      bg-[#0B1120]
      border-r border-white/10
      backdrop-blur-xl
      p-6
      z-50
    ">

      <h1 className="
        text-3xl
        font-black
        text-cyan-300
        mb-10
      ">
        SOL AI BOT
      </h1>

      <div className="space-y-4">

        {navItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4
                px-5 py-4
                rounded-2xl
                transition-all duration-300
                ${isActive
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"}
              `}
            >

              <Icon size={22} />

              <span className="font-semibold">
                {item.name}
              </span>

            </NavLink>

          );

        })}

      </div>

    </div>

  );

};

export default Sidebar;