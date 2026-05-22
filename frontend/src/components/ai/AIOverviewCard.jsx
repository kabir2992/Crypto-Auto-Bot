import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  ShieldAlert
} from "lucide-react";

const AIOverviewCard = ({
  decision,
  confidence,
  marketTrend,
  riskLevel
}) => {

  const decisionColor =
    decision === "BUY"
      ? "text-emerald-400"
      : decision === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  const trendColor =
    marketTrend === "BULLISH"
      ? "text-emerald-400"
      : marketTrend === "BEARISH"
      ? "text-red-400"
      : "text-yellow-400";

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
    ">

      {/* DECISION */}

      <div className="
        rounded-3xl
        p-6
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        shadow-2xl
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-5
        ">

          <p className="text-slate-400">
            AI Decision
          </p>

          <BrainCircuit className="text-cyan-400" />

        </div>

        <h2 className={`
          text-5xl
          font-black
          ${decisionColor}
        `}>

          {decision}

        </h2>

      </div>

      {/* CONFIDENCE */}

      <div className="
        rounded-3xl
        p-6
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        shadow-2xl
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-5
        ">

          <p className="text-slate-400">
            Confidence
          </p>

          <BrainCircuit className="text-purple-400" />

        </div>

        <h2 className="
          text-5xl
          font-black
          text-purple-400
        ">

          {confidence}%

        </h2>

      </div>

      {/* MARKET TREND */}

      <div className="
        rounded-3xl
        p-6
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        shadow-2xl
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-5
        ">

          <p className="text-slate-400">
            Market Trend
          </p>

          {
            marketTrend === "BULLISH"
              ? <TrendingUp className="text-emerald-400" />
              : <TrendingDown className="text-red-400" />
          }

        </div>

        <h2 className={`
          text-4xl
          font-black
          ${trendColor}
        `}>

          {marketTrend}

        </h2>

      </div>

      {/* RISK */}

      <div className="
        rounded-3xl
        p-6
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        shadow-2xl
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-5
        ">

          <p className="text-slate-400">
            Risk Level
          </p>

          <ShieldAlert className="text-red-400" />

        </div>

        <h2 className="
          text-4xl
          font-black
          text-red-400
        ">

          {riskLevel}

        </h2>

      </div>

    </div>

  );

};

export default AIOverviewCard;