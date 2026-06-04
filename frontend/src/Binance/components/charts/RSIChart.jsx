import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from "recharts";

import GlassCard from "../ui/GlassCard";

const RSIChart = ({
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

      rsi: item.rsi

    }));

  const latestRSI =
    formattedData[
      formattedData.length - 1
    ]?.rsi || 0;

  return (

    <GlassCard className="
      p-6
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        justify-between
        mb-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-black
            text-white
          ">

            RSI Indicator

          </h2>

          <p className="
            text-slate-400
            mt-1
          ">

            Overbought & Oversold Zones

          </p>

        </div>

        <div className="
          rounded-2xl
          px-4
          py-3
          bg-cyan-500/10
          border
          border-cyan-400/10
        ">

          <p className="
            text-xs
            text-slate-400
          ">

            CURRENT RSI

          </p>

          <h2 className="
            text-2xl
            font-black
            text-cyan-300
          ">

            {latestRSI.toFixed(2)}

          </h2>

        </div>

      </div>

      {/* CHART */}

      <div className="
        h-[320px]
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
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
              domain={[0, 100]}
              stroke="#94a3b8"
            />

            <Tooltip />

            {/* OVERBOUGHT */}

            <ReferenceArea
              y1={70}
              y2={100}
              fill="red"
              fillOpacity={0.08}
            />

            {/* OVERSOLD */}

            <ReferenceArea
              y1={0}
              y2={30}
              fill="green"
              fillOpacity={0.08}
            />

            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </GlassCard>

  );

};

export default RSIChart;