import { BrainCircuit, TrendingUp, TrendingDown, ShieldAlert, BarChart2 } from "lucide-react";

// Called once per card — matches how AIAnalytics.jsx uses it
const AIOverviewCard = ({ title, value, type }) => {

  const styles = {
    decision: {
      color: value === "BUY" ? "text-emerald-400" : value === "SELL" ? "text-red-400" : "text-yellow-400",
      border: "border-white/10", bg: "bg-white/5",
      icon: <BrainCircuit className="text-cyan-400" size={20} />
    },
    trend: {
      color: value === "BULLISH" ? "text-emerald-400" : value === "BEARISH" ? "text-red-400" : "text-yellow-400",
      border: "border-white/10", bg: "bg-white/5",
      icon: value === "BULLISH"
        ? <TrendingUp className="text-emerald-400" size={20} />
        : <TrendingDown className="text-red-400" size={20} />
    },
    risk: {
      color: value === "LOW" ? "text-emerald-400" : value === "MEDIUM" ? "text-yellow-400" : "text-red-400",
      border: "border-white/10", bg: "bg-white/5",
      icon: <ShieldAlert className="text-red-400" size={20} />
    },
    rsi: {
      color: value > 70 ? "text-red-400" : value < 30 ? "text-emerald-400" : "text-cyan-400",
      border: "border-white/10", bg: "bg-white/5",
      icon: <BarChart2 className="text-cyan-400" size={20} />
    },
  };

  const s = styles[type] || styles.decision;

  return (
    <div className={`rounded-3xl p-6 ${s.bg} border ${s.border} backdrop-blur-xl shadow-2xl`}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm uppercase tracking-widest">{title}</p>
        {s.icon}
      </div>
      <h2 className={`text-5xl font-black ${s.color}`}>{value}</h2>
    </div>
  );
};

export default AIOverviewCard;