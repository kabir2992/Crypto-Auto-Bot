import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";

import GlassCard from "../ui/GlassCard";

const MACDChart = ({
  chartData = []
}) => {

  const formattedData =
    chartData.map((item) => ({

      time:
        new Date(
          item.originalTime
        ).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          }
        ),

      macd:
        item.macd || 0,

      signal:
        item.signal || 0,

      histogram:
        item.histogram || 0

    }));

  const latestMACD =
    formattedData[
      formattedData.length - 1
    ]?.macd || 0;

  const latestSignal =
    formattedData[
      formattedData.length - 1
    ]?.signal || 0;

  const bullish =
    latestMACD >
    latestSignal;

  return (

    <GlassCard className="
      p-6
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        mb-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-black
            text-white
          ">

            MACD Momentum

          </h2>

          <p className="
            mt-2
            text-slate-400
          ">

            Trend reversal & momentum strength

          </p>

        </div>

        <div className={`
          rounded-2xl
          px-5
          py-3
          border
          ${
            bullish
              ? `
                bg-green-500/10
                border-green-400/10
              `
              : `
                bg-red-500/10
                border-red-400/10
              `
          }
        `}>

          <p className="
            text-xs
            text-slate-400
            mb-1
          ">

            SIGNAL STATUS

          </p>

          <h2 className={`
            text-xl
            font-black
            ${
              bullish
                ? "text-green-300"
                : "text-red-300"
            }
          `}>

            {
              bullish
                ? "BULLISH"
                : "BEARISH"
            }

          </h2>

        </div>

      </div>

      {/* CHART */}

      <div className="
        h-[340px]
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <ComposedChart
            data={formattedData}
          >

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip />

            <ReferenceLine
              y={0}
              stroke="#475569"
            />

            {/* HISTOGRAM */}

            <Bar
              dataKey="histogram"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
            />

            {/* MACD */}

            <Line
              type="monotone"
              dataKey="macd"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />

            {/* SIGNAL */}

            <Line
              type="monotone"
              dataKey="signal"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={false}
            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>

    </GlassCard>

  );

};

export default MACDChart;