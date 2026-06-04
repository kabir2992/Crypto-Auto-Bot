import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";

import GlassCard from "../ui/GlassCard";

const MainChart = ({
  chartData = [],
  botState
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

      close: item.close,

      ema20: item.ema20,

      ema50: item.ema50

    }));

  const currentPrice =
    formattedData[
      formattedData.length - 1
    ]?.close || 0;

  const averageBuyPrice =
    botState?.averageBuyPrice || 0;

  const inProfit =
    currentPrice >
    averageBuyPrice;

  return (

    <GlassCard className="
      p-6
      overflow-hidden
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h2 className="
            text-3xl
            font-black
            text-white
          ">

            Advanced Market Chart

          </h2>

          <p className="
            mt-2
            text-slate-400
          ">

            Real-time SOLUSDT AI price movement

          </p>

        </div>

        <div className="
          flex
          items-center
          gap-4
          flex-wrap
        ">

          <div className="
            rounded-2xl
            bg-cyan-500/10
            border
            border-cyan-400/10
            px-5
            py-3
          ">

            <p className="
              text-xs
              text-slate-400
              mb-1
            ">

              LIVE PRICE

            </p>

            <h2 className="
              text-xl
              font-black
              text-cyan-300
            ">

              ${currentPrice.toFixed(2)}

            </h2>

          </div>

          <div className={`
            rounded-2xl
            px-5
            py-3
            border
            ${
              inProfit
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

              PROFIT ZONE

            </p>

            <h2 className={`
              text-xl
              font-black
              ${
                inProfit
                  ? "text-green-300"
                  : "text-red-300"
              }
            `}>

              {
                inProfit
                  ? "ACTIVE"
                  : "LOSS"
              }

            </h2>

          </div>

        </div>

      </div>

      {/* CHART */}

      <div className="
        h-[500px]
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
              domain={[
                "dataMin - 0.5",
                "dataMax + 0.5"
              ]}
            />

            <Tooltip
              contentStyle={{
                background:
                  "#020617",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius:
                  "16px",
                color:
                  "#fff"
              }}
            />

            {/* BUY LINE */}

            {
              averageBuyPrice > 0 && (

                <ReferenceLine
                  y={averageBuyPrice}
                  stroke="#22c55e"
                  strokeDasharray="6 6"
                  label="BUY"
                />

              )
            }

            {/* PRICE */}

            <Area
              type="monotone"
              dataKey="close"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.15}
              strokeWidth={3}
            />

            {/* EMA20 */}

            <Line
              type="monotone"
              dataKey="ema20"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />

            {/* EMA50 */}

            <Line
              type="monotone"
              dataKey="ema50"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>

    </GlassCard>

  );

};

export default MainChart;