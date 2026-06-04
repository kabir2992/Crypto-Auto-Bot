import { Activity, ShieldAlert, Target, DollarSign } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const AIConfidenceBar = ({ confidence = 0, strategy }) => {
  const pct = Math.min(100, Math.max(0, confidence));
  const color = pct >= 75 ? "text-emerald-400" : pct >= 50 ? "text-yellow-400" : "text-red-400";
  const barColor = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const label = pct >= 75 ? "High Confidence" : pct >= 50 ? "Moderate" : "Low Confidence";

  return (
    <GlassCard className="p-7">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-400/10 flex items-center justify-center">
          <Activity size={28} className="text-purple-300" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">AI Confidence</h2>
          <p className="text-slate-400">Signal strength of current decision</p>
        </div>
      </div>

      {strategy && (
        <div className="rounded-2xl border border-purple-400/10 bg-purple-500/10 px-5 py-3 mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Strategy</p>
          <p className="text-purple-300 font-bold">{strategy}</p>
        </div>
      )}

      <div className="flex items-end justify-between mb-3">
        <span className={`text-6xl font-black ${color}`}>{pct}%</span>
        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/5 text-slate-300">{label}</span>
      </div>

      <div className="h-3 rounded-full bg-white/5 overflow-hidden mt-4">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
            boxShadow: `0 0 12px ${barColor}60`
          }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </GlassCard>
  );
};

export default AIConfidenceBar;