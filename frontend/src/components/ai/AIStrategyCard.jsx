import {
  Activity,
  ShieldAlert,
  Target,
  DollarSign
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

const AIStrategyCard = ({
  aiData
}) => {

  return (

    <GlassCard className="
      p-7
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        gap-4
        mb-8
      ">

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-yellow-500/10
          border
          border-yellow-400/10
          flex
          items-center
          justify-center
        ">

          <Activity
            size={28}
            className="
              text-yellow-300
            "
          />

        </div>

        <div>

          <h2 className="
            text-3xl
            font-black
            text-white
          ">

            AI Strategy Engine

          </h2>

          <p className="
            text-slate-400
          ">

            Live AI strategy prediction

          </p>

        </div>

      </div>

      {/* STRATEGY */}

      <div className="
        rounded-3xl
        border
        border-yellow-400/10
        bg-yellow-500/10
        p-6
        mb-7
      ">

        <h2 className="
          text-4xl
          font-black
          text-yellow-300
          mb-4
        ">

          {
            aiData?.strategy ||
            "NO STRATEGY"
          }

        </h2>

        <p className="
          text-slate-300
          leading-8
          text-lg
        ">

          {
            aiData?.summary ||
            "No summary available."
          }

        </p>

      </div>

      {/* TARGETS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
      ">

        {/* ENTRY */}

        <div className="
          rounded-3xl
          border
          border-green-400/10
          bg-green-500/10
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">

            <DollarSign
              size={20}
              className="
                text-green-300
              "
            />

            <p className="
              text-slate-300
            ">

              Entry

            </p>

          </div>

          <h2 className="
            text-4xl
            font-black
            text-green-300
          ">

            ${aiData?.recommendedEntry || 0}

          </h2>

        </div>

        {/* STOP LOSS */}

        <div className="
          rounded-3xl
          border
          border-red-400/10
          bg-red-500/10
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">

            <ShieldAlert
              size={20}
              className="
                text-red-300
              "
            />

            <p className="
              text-slate-300
            ">

              Stop Loss

            </p>

          </div>

          <h2 className="
            text-4xl
            font-black
            text-red-300
          ">

            ${aiData?.recommendedStopLoss || 0}

          </h2>

        </div>

        {/* TAKE PROFIT */}

        <div className="
          rounded-3xl
          border
          border-cyan-400/10
          bg-cyan-500/10
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">

            <Target
              size={20}
              className="
                text-cyan-300
              "
            />

            <p className="
              text-slate-300
            ">

              Take Profit

            </p>

          </div>

          <h2 className="
            text-4xl
            font-black
            text-cyan-300
          ">

            ${aiData?.recommendedTakeProfit || 0}

          </h2>

        </div>

      </div>

    </GlassCard>

  );

};

export default AIStrategyCard;