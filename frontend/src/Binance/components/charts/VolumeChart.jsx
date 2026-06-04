import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

import GlassCard from "../ui/GlassCard";

const VolumeChart = ({
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

      volume:
        item.volume || 0,

      bullish:
        item.close >= item.open

    }));

  const latestVolume =
    formattedData[
      formattedData.length - 1
    ]?.volume || 0;

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

            Market Volume

          </h2>

          <p className="
            mt-2
            text-slate-400
          ">

            Buyer vs seller pressure analysis

          </p>

        </div>

        <div className="
          rounded-2xl
          px-5
          py-3
          border
          border-cyan-400/10
          bg-cyan-500/10
        ">

          <p className="
            text-xs
            text-slate-400
            mb-1
          ">

            LIVE VOLUME

          </p>

          <h2 className="
            text-xl
            font-black
            text-cyan-300
          ">

            {Number(latestVolume).toFixed(2)}

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

          <BarChart
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

            <Bar
              dataKey="volume"
              radius={[6, 6, 0, 0]}
            >

              {
                formattedData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        entry.bullish
                          ? "#22c55e"
                          : "#ef4444"
                      }
                    />

                  )
                )
              }

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </GlassCard>

  );

};

export default VolumeChart;