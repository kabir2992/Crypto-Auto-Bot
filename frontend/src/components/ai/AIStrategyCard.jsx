import { Activity, ShieldAlert, Target, DollarSign } from "lucide-react";
import GlassCard from "../ui/GlassCard";

// Receives individual props — matches how AIAnalytics.jsx calls it
const AIStrategyCard = ({ strategy, summary, trend }) => {

  const trendColor = trend === "BULLISH"
    ? "text-emerald-400"
    : trend === "BEARISH"
    ? "text-red-400"
    : "text-yellow-400";

  return (
    <GlassCard className="p-7">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-400/10 flex items-center justify-center">
          <Activity size={28} className="text-yellow-300" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">AI Strategy Engine</h2>
          <p className="text-slate-400">Live AI strategy prediction</p>
        </div>
      </div>

      {/* STRATEGY */}
      <div className="rounded-3xl border border-yellow-400/10 bg-yellow-500/10 p-6 mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-3xl font-black text-yellow-300">
            {strategy || "NO STRATEGY"}
          </h2>
          {trend && (
            <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/5 ${trendColor}`}>
              {trend}
            </span>
          )}
        </div>
        <p className="text-slate-300 leading-8 text-lg">
          {summary || "No summary available."}
        </p>
      </div>

    </GlassCard>
  );
};

export default AIStrategyCard;