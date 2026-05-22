import { BrainCircuit } from "lucide-react";
import GlassCard from "../ui/GlassCard";

// Called once per reason in a .map() — receives single reason string + index
const AIReasonCard = ({ reason, index }) => {
  if (!reason) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/20 transition-all">
      <div className="flex items-start gap-4">
        <div className="min-w-[42px] h-[42px] rounded-2xl bg-cyan-500/10 border border-cyan-400/10 flex items-center justify-center text-cyan-300 font-black flex-shrink-0">
          {index + 1}
        </div>
        <p className="text-slate-300 leading-8">{reason}</p>
      </div>
    </div>
  );
};

export default AIReasonCard;