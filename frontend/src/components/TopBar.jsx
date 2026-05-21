import ThemeToggle from "../components/shared/ThemeToggle";

const Topbar = ({
  livePrice,
  nextAnalysisTime
}) => {

  return (
    <div
      className="
      h-24
      flex items-center justify-between
      px-8
      border-b border-white/10
      bg-[#050816]/70
      backdrop-blur-xl
      sticky top-0 z-50
    "
    >
      <div>
        <h1 className="text-3xl font-black text-white">
          SOLUSDT
        </h1>

        <p className="text-gray-400">
          AI Trading Dashboard
        </p>
      </div>

      <div className="flex items-center gap-5">

        {/* LIVE PRICE */}
        <div className="
          px-5 py-3 rounded-2xl
          bg-cyan-500/10
          border border-cyan-500/20
        ">
          <p className="text-xs text-gray-400">
            Live Price
          </p>

          <h2 className="text-xl font-bold text-cyan-300">
            ${Number(livePrice || 0).toFixed(2)}
          </h2>
        </div>

        {/* NEXT ANALYSIS */}
        <div className="
          px-5 py-3 rounded-2xl
          bg-indigo-500/10
          border border-indigo-500/20
        ">
          <p className="text-xs text-gray-400">
            Next Analysis
          </p>

          <h2 className="text-sm font-bold text-indigo-300">
            {nextAnalysisTime
              ? new Date(nextAnalysisTime).toLocaleTimeString()
              : "--"}
          </h2>
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
};

export default Topbar;