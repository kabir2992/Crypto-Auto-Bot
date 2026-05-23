import {
  LayoutDashboard,
  CandlestickChart,
  BrainCircuit,
  History,
  Wallet,
  MonitorSmartphone,
  X
} from "lucide-react";

import {
  NavLink
} from "react-router-dom";

const MobileSidebar = ({
  mobileSidebarOpen,
  setMobileSidebarOpen
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

    <>
      {/* ========================= */}
      {/* OVERLAY */}
      {/* ========================= */}

      <div
        onClick={() =>
          setMobileSidebarOpen(false)
        }
        className={`
          fixed
          inset-0
          z-40
          bg-black/60
          backdrop-blur-sm
          transition-all
          duration-300
          md:hidden

          ${
            mobileSidebarOpen
              ? `
                opacity-100
                pointer-events-auto
              `
              : `
                opacity-0
                pointer-events-none
              `
          }
        `}
      />

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <aside className={`
        fixed
        top-0
        left-0
        z-50
        h-screen
        w-[280px]
        bg-[#020617]
        border-r
        border-white/10
        backdrop-blur-xl
        flex
        flex-col
        transition-all
        duration-300
        md:hidden

        ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}>

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="
          h-[80px]
          border-b
          border-white/10
          px-5
          flex
          items-center
          justify-between
        ">

          <div className="
            flex
            items-center
            gap-3
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
            ">

              <span className="
                text-xl
                font-black
                text-white
              ">

                ₿

              </span>

            </div>

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

          </div>

          {/* CLOSE */}

          <button
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            className="
              w-10
              h-10
              rounded-xl
              border
              border-white/10
              bg-white/5
              flex
              items-center
              justify-center
              text-slate-300
            "
          >

            <X size={20} />

          </button>

        </div>

        {/* ========================= */}
        {/* NAVIGATION */}
        {/* ========================= */}

        <div className="
          flex-1
          overflow-y-auto
          px-3
          py-6
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
                    onClick={() =>
                      setMobileSidebarOpen(false)
                    }
                    className={({ isActive }) => `
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      px-4
                      py-4
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            bg-gradient-to-r
                            from-cyan-500/20
                            to-blue-500/10
                            border
                            border-cyan-400/20
                            text-cyan-300
                          `
                          : `
                            text-slate-400
                            hover:bg-white/5
                            hover:text-white
                          `
                      }
                    `}
                  >

                    <Icon size={22} />

                    <span className="
                      font-semibold
                    ">

                      {item.name}

                    </span>

                  </NavLink>

                );

              })
            }

          </div>

        </div>

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}

        <div className="
          border-t
          border-white/10
          p-4
        ">

          <div className="
            rounded-2xl
            border
            border-emerald-400/10
            bg-gradient-to-r
            from-emerald-500/10
            to-cyan-500/10
            p-4
          ">

            <p className="
              text-xs
              text-slate-400
              mb-2
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
              " />

              <p className="
                text-sm
                font-bold
                text-green-300
              ">

                LIVE TRADING

              </p>

            </div>

          </div>

        </div>

      </aside>
    </>

  );

};

export default MobileSidebar;