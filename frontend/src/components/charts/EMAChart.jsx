import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import GlassCard from "../ui/GlassCard";

const EMAChart = ({
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

      ema20: item.ema20,

      ema50: item.ema50

    }));

  return (

    <GlassCard className="
      p-6
    ">

      <div className="
        mb-6
      ">

        <h2 className="
          text-2xl
          font-black
          text-white
        ">

          EMA Trend Strength

        </h2>

        <p className="
          mt-2
          text-slate-400
        ">

          EMA20 vs EMA50 crossover intelligence

        </p>

      </div>

      <div className="
        h-[320px]
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
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

            <Area
              type="monotone"
              dataKey="ema20"
              fill="#22c55e"
              stroke="#22c55e"
              fillOpacity={0.1}
            />

            <Line
              type="monotone"
              dataKey="ema50"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </GlassCard>

  );

};

export default EMAChart;