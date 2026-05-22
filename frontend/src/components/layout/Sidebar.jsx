import {
  LayoutDashboard,
  CandlestickChart,
  BrainCircuit,
  History,
  Wallet,
  MonitorSmartphone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import {
  NavLink
} from "react-router-dom";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen
}) => {

  const navItems = [

    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },

    {
      name: "Charts",
      path: "/charts",
      icon: CandlestickChart
    },

    {
      name: "AI Analytics",
      path: "/ai-analytics",
      icon: BrainCircuit
    },

    {
      name: "Trade History",
      path: "/trade-history",
      icon: History
    },

    {
      name: "Money",
      path: "/money-management",
      icon: Wallet
    },

    {
      name: "Mini Dashboard",
      path: "/mini-dashboard",
      icon: MonitorSmartphone
    }

  ];

  return (

    <aside className={`
      h-screen
      sticky
      top-0
      z-40
      transition-all
      duration-300
      border-r
      border-white/10
      bg-[#020617]
      backdrop-blur-xl
      flex
      flex-col
      ${sidebarOpen ? "w-[280px]" : "w-[74px]"}
    `}>

      {/* TOP LOGO */}

      <div className="
        h-[80px]
        flex
        items-center
        justify-between
        px-5
        border-b
        border-white/10
      ">

        {/* LOGO */}

        <div className="
          flex
          items-center
          gap-3
          overflow-hidden
        ">

          <div className="
            w-11
            h-11
            rounded-2xl
            bg-gradient-to-br
            from-cyan-400
            via-blue-500
            to-indigo-600
            flex
            items-center
            justify-center
            shadow-lg
            shadow-cyan-500/20
            shrink-0
          ">

            <span className="
              text-white
              font-black
              text-xl
            ">

              ₿

            </span>

          </div>

          {
            sidebarOpen && (

              <div>

                <h2 className="
                  text-lg
                  font-black
                  text-white
                ">

                  Crypto AI BOT

                </h2>

                <p className="
                  text-xs
                  text-slate-400
                ">

                  Quantum Trading

                </p>

              </div>

            )
          }

        </div>

        {/* TOGGLE */}

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="
            hidden
            md:flex
            items-center
            justify-center
            w-9
            h-9
            rounded-xl
            bg-white/5
            border
            border-white/10
            text-slate-300
            hover:bg-cyan-500/20
            hover:text-cyan-300
            transition-all
            shrink-0
          "
        >

          {
            sidebarOpen
              ? <ChevronLeft size={18} />
              : <ChevronRight size={18} />
          }

        </button>

      </div>

      {/* NAVIGATION */}

      <div className="
        flex-1
        overflow-y-auto
        py-6
        px-3
      ">

        <div className="
          flex
          flex-col
          gap-2
        ">

          {
            navItems.map((item) => {

              const Icon =
                item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    group
                    relative
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    py-4
                    transition-all
                    duration-300
                    overflow-hidden
                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-cyan-500/20
                          to-blue-500/10
                          border
                          border-cyan-400/20
                          text-cyan-300
                          shadow-lg
                          shadow-cyan-500/10
                        `
                        : `
                          text-slate-400
                          hover:bg-white/5
                          hover:text-white
                        `
                    }
                  `}
                >

                  {/* ICON */}

                  <Icon
                    size={22}
                    className="
                      shrink-0
                    "
                  />

                  {/* LABEL */}

                  {
                    sidebarOpen && (

                      <span className="
                        font-semibold
                        whitespace-nowrap
                      ">

                        {item.name}

                      </span>

                    )
                  }

                </NavLink>

              );

            })
          }

        </div>

      </div>

      {/* FOOTER */}

      <div className="
        border-t
        border-white/10
        p-4
      ">

        <div className="
          rounded-2xl
          bg-gradient-to-r
          from-emerald-500/10
          to-cyan-500/10
          border
          border-emerald-400/10
          p-4
        ">

          {
            sidebarOpen ? (

              <>
                <p className="
                  text-xs
                  text-slate-400
                  mb-1
                ">

                  SYSTEM STATUS

                </p>

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <div className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-green-400
                    animate-pulse
                  "></div>

                  <p className="
                    text-sm
                    font-bold
                    text-green-300
                  ">

                    LIVE TRADING

                  </p>

                </div>
              </>

            ) : 
            (

              <div className="
                flex
                justify-center
              ">

                <div className="
                  w-3
                  h-3
                  rounded-full
                  bg-green-400
                  animate-pulse
                "></div>

              </div>

            )
          }

        </div>

      </div>

    </aside>

  );

};

export default Sidebar;