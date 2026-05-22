import {
  Menu,
  Bell,
  Activity
} from "lucide-react";

import useLivePrice from "../../hooks/useLivePrice";

import useTheme from "../../hooks/useTheme";

const Topbar = ({
  sidebarOpen,
  setSidebarOpen
}) => {

  const livePrice =
    useLivePrice();

  const {
    theme,
    toggleTheme
  } = useTheme();

  return (

    <header className="
      sticky
      top-0
      z-30
      h-[80px]
      border-b
      text-slate-700 dark:text-slate-300
      bg-white/90 dark:bg-[#020617]/90
      backdrop-blur-xl
      flex
      items-center
      justify-between
      px-4
      md:px-6
    ">

      {/* LEFT */}

      <div className="
        flex
        items-center
        gap-4
      ">

        {/* MOBILE SIDEBAR BUTTON */}

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="
            md:hidden
            w-11
            h-11
            rounded-xl
            bg-white/5
            border
            border-slate-200 dark:border-white/10
            flex
            items-center
            justify-center
            text-slate-700 dark:text-slate-300
          "
        >

          <Menu size={22} />

        </button>

        {/* LIVE PRICE */}

        <div className="
          rounded-2xl
          border
          border-cyan-400/10
          bg-cyan-500/10
          px-4
          py-2.5
        ">

          <p className="
            text-xs
            text-slate-400
            mb-1
          ">

            SOLUSDT LIVE

          </p>

          <div className="
            flex
            items-center
            gap-2
          ">

            <Activity
              size={16}
              className="
                text-green-400
              "
            />

            <h2 className="
              text-lg
              font-black
              text-cyan-300
            ">

              ${
                Number(
                  livePrice || 0
                ).toFixed(2)
              }

            </h2>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="
        flex
        items-center
        gap-3
      ">

        {/* THEME */}

        <button
          onClick={toggleTheme}
          className="
            h-11
            px-4
            rounded-xl
            border
            border-slate-200 dark:border-white/10
            bg-white/5
            text-sm
            font-semibold
            text-slate-700 dark:text-slate-700 dark:text-slate-300
            hover:bg-cyan-500/20
            transition-all
          "
        >

          {
            theme === "dark"
              ? "☀️ Light"
              : "🌙 Dark"
          }

        </button>

        {/* NOTIFICATION */}

        <button className="
          relative
          w-11
          h-11
          rounded-xl
          border
          border-slate-200 dark:border-white/10
          bg-white/5
          flex
          items-center
          justify-center
          text-slate-700 dark:text-slate-700 dark:text-slate-300
          hover:bg-white/10
          transition-all
        ">

          <Bell size={19} />

          <span className="
            absolute
            top-2
            right-2
            w-2
            h-2
            rounded-full
            bg-red-500
          "></span>

        </button>

      </div>

    </header>

  );

};

export default Topbar;