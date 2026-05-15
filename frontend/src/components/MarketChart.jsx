// import { useEffect, useRef, setInterval } from "react";
// import { createChart, AreaSeries } from "lightweight-charts";

// const MarketChart = ({ chartData }) => {
//     const chartContainerRef = useRef();

//     useEffect(() => {
//         if (!chartData.length) {
//             return;
//         }

//         const chart = createChart(chartContainerRef.current, {
//             width: chartContainerRef.clientWidth,
//             height: 450,

//             layout: {
//                 background: {
//                     color: "#050816"
//                 },
//                 textColor: "#CBD5E1"
//             },
//             grid: {
//                 vertLines: {
//                     color: "#1E293B"
//                 },
//                 horzLines: {
//                     color: "#1E293B"
//                 }
//             },
//             crosshair: {
//                 mode: 3
//             },
//             rightPriceScale: {
//                 borderColor: "#334155"
//             },
//             timeScale: {
//                 borderColor: "#334155",
//                 timeVisible: true,
//                 secondsVisible: true,
//                 // THIS enables scrolling
//                 fixLeftEdge: false,
//                 fixRightEdge: false,
//                 // Smooth scrolling
//                 rightOffset: 5,
//                 // User can drag
//                 lockVisibleTimeRangeOnResize: false,
//                 // Zoom enabled
//                 barSpacing: 20,
//                 minBarSpacing: 15,
//                 tickMarkFormatter: (time) => {
//                     return new Date(time * 1000).toLocaleTimeString("en-IN",
//                         {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             hour12: true,
//                             timeZone: "Asia/Kolkata"
//                         });
//                 }
//             }
//         });

//         // Area Series
//         const areaSeries =
//             chart.addSeries(AreaSeries, {
//                 topColor: "rgba(99,102,241,0.6)",
//                 bottomColor: "rgba(99,102,241,0.05)",
//                 lineColor: "#818CF8",
//                 lineWidth: 8
//             });

//         // Format data
//         const formattedData =
//             chartData.map(item => ({
//                 time: Math.floor(item.originalTime / 1000),
//                 value: Number(item.close)
//             }));
//         console.log(formattedData);

//         areaSeries.setData(formattedData);
//         // Auto fit
//         chart.timeScale().fitContent();
//         const tooltip = document.createElement("div");
//         tooltip.className = ` absolute bg-[#111827] text-white text-sm px-4 py-3 rounded-2xl border border-white/10 shadow-2xl pointer-events-none z-50 backdrop-blur-xl `;
//         tooltip.style.display = "none";
//         chartContainerRef.current.appendChild(tooltip);
//         // Hover Listener
//         chart.subscribeCrosshairMove(
//             (param) => {
//                 if ( !param.point || !param.time || param.point.x < 0 || param.point.y < 0 ) 
//                 {
//                     tooltip.style.display = "none";
//                     return;
//                 }

//                 const data = param.seriesData.get( areaSeries );
//                 if (!data) return;

//                 // Convert to IST
//                 const formattedTime = new Date( param.time * 1000 ).toLocaleString( "en-IN",
//                         {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             second: "2-digit",
//                             hour12: true,
//                             timeZone: "Asia/Kolkata"
//                         }
//                     );
//                 tooltip.innerHTML = `
//           <div class="mb-1">
//             <span class="text-gray-400">
//               Price:
//             </span>
//             <span class="font-bold text-indigo-300">
//               $${data.value.toFixed(2)}
//             </span>
//           </div>
//           <div>
//             <span class="text-gray-400">
//               Time:
//             </span>
//             <span class="font-bold text-green-300">
//               ${formattedTime}
//             </span>
//           </div>
//         `;
//                 tooltip.style.display = "block";
//                 tooltip.style.left = param.point.x + 20 + "px";
//                 tooltip.style.top = param.point.y + 20 + "px";
//             }
//         );

//         // Resize support
//         const handleResize = () => {
//             chart.applyOptions({
//                 width: chartContainerRef.current.clientWidth
//             });
//         };
//         window.addEventListener("resize", handleResize);
//         return () => {
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, [chartData]);

//     return (
//         <div className=" bg-[#0B1120] border border-white/10 rounded-3xl shadow-2xl overflow-hidden mb-8">

//             {/* Header */}
//             <div className=" flex items-center justify-between px-6 py-5 border-b border-white/10 ">

//                 <div>

//                     <h2 className=" text-2xl font-bold text-white ">
//                         SOLUSDT Market Chart
//                     </h2>

//                     <p className=" text-sm text-gray-400 mt-1 ">
//                         Scroll left to view history •
//                         Zoom with mouse wheel
//                     </p>

//                 </div>

//                 <div className=" px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium ">
//                     LIVE
//                 </div>

//             </div>

//             {/* Chart */}
//             <div ref={chartContainerRef} className="w-full" />

//         </div>

//     );
// };

// export default MarketChart;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
  Area,
  ComposedChart
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label
}) => {

  if (
    active &&
    payload &&
    payload.length
  ) {

    return (

      <div className="
        bg-[#0B1120]
        border
        border-white/10
        rounded-2xl
        p-4
        shadow-2xl
        backdrop-blur-xl
      ">

        <p className="
          text-gray-400
          text-sm
          mb-2
        ">

          {label}

        </p>

        {
          payload.map(
            (item, index) => (

              <p
                key={index}
                style={{
                  color: item.color
                }}
                className="
                  font-semibold
                "
              >

                {item.name}: {
                  Number(
                    item.value
                  ).toFixed(2)
                }

              </p>

            )
          )
        }

      </div>

    );

  }

  return null;

};

const MarketChart = ({
  chartData = [],
  botState
}) => {

  const formattedData =
    (Array.isArray(chartData) ? chartData : []).map(item => ({

      time:
        new Date(
          item.originalTime
        ).toLocaleTimeString(
          "en-IN",
          {

            hour: "2-digit",

            minute: "2-digit",

            hour12: true,

            timeZone:
              "Asia/Kolkata"

          }
        ),

      close:
        item.close,

      ema20:
        item.ema20,

      ema50:
        item.ema50,

      rsi:
        item.rsi

    }));

  const currentPrice =
    formattedData[
      formattedData.length - 1
    ]?.close || 0;

  const avgBuyPrice =
    botState?.averageBuyPrice || 0;

  const inProfit =
    currentPrice > avgBuyPrice;

  const latestCandle = formattedData[formattedData.length - 1];

  const emaGap = Math.abs((latestCandle?.ema20 || 0) - (latestCandle?.ema50 || 0));

  const trendLabel = !latestCandle?.ema20 || !latestCandle?.ema50
      ? "Loading"
      : emaGap < 0.05
        ? "Sideways"
        : latestCandle.ema20 > latestCandle.ema50
          ? "Bullish"
          : "Bearish";

  const showRsiChart = true;

  return (

    <div className="
      bg-[#0B1120]
      border
      border-white/10
      rounded-3xl
      p-6
      shadow-2xl
      mb-8
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
            font-bold
            text-white
          ">

            SOLUSDT Advanced Chart

          </h2>

          <p className="
            text-gray-400
            mt-2
          ">

            EMA 20 • EMA 50 • RSI • Profit Zones

          </p>

        </div>

        <div className="
          flex
          gap-4
          flex-wrap
        ">

          {/* TREND */}
          <div className="
            px-4
            py-2
            rounded-2xl
            bg-indigo-500/10
            border
            border-indigo-500/20
          ">

            <p className="
              text-xs
              text-gray-400
            ">

              Trend

            </p>

            <p className="
              text-indigo-300
              font-bold
            ">

              {trendLabel}

            </p>

          </div>

          {/* PROFIT */}
          <div className="
            px-4
            py-2
            rounded-2xl
            bg-green-500/10
            border
            border-green-500/20
          ">

            <p className="
              text-xs
              text-gray-400
            ">

              Profit Zone

            </p>

            <p className="
              text-green-300
              font-bold
            ">

              {
                inProfit
                ? "ACTIVE"
                : "WAITING"
              }

            </p>

          </div>

          {/* RSI */}
          <div className="
            px-4
            py-2
            rounded-2xl
            bg-cyan-500/10
            border
            border-cyan-500/20
          ">

            <p className="
              text-xs
              text-gray-400
            ">

              RSI

            </p>

            <p className="
              text-cyan-300
              font-bold
            ">

                          {
                              formattedData[formattedData.length - 1]?.rsi != null
                                  ? formattedData[formattedData.length - 1].rsi.toFixed(2)
                                  : "--"
                          }


            </p>

          </div>

        </div>

      </div>

      {/* MAIN CHART */}
      <div className="
        h-[450px]
        mb-12
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <ComposedChart
            data={formattedData}
          >

            <CartesianGrid
              stroke="#1E293B"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              minTickGap={40}
            />

            <YAxis
              stroke="#94A3B8"
              domain={[
                "dataMin - 1",
                "dataMax + 1"
              ]}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

            {/* PROFIT ZONE */}
            {
              avgBuyPrice > 0 && (

                <ReferenceArea
                  y1={avgBuyPrice}
                  y2={999999}
                  fill="green"
                  fillOpacity={0.08}
                />

              )
            }

            {/* LOSS ZONE */}
            {
              avgBuyPrice > 0 && (

                <ReferenceArea
                  y1={0}
                  y2={avgBuyPrice}
                  fill="red"
                  fillOpacity={0.06}
                />

              )
            }

            {/* PRICE AREA */}
            <Area
              type="monotone"
              dataKey="close"
              stroke="#818CF8"
              fill="#6366F1"
              fillOpacity={0.15}
              strokeWidth={3}
              name="Price"
            />

            {/* EMA 20 */}
            <Line
              type="monotone"
              dataKey="ema20"
              stroke="#22C55E"
              strokeWidth={2}
              dot={false}
              name="EMA 20"
            />

            {/* EMA 50 */}
            <Line
              type="monotone"
              dataKey="ema50"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="EMA 50"
            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>

      {/* RSI CHART */}
       {showRsiChart && (
      <div className="
        h-[220px]
      ">

        <h3 className="
          text-xl
          font-bold
          text-white
          mb-4
        ">

          RSI Indicator

        </h3>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={formattedData}
          >

            <CartesianGrid
              stroke="#1E293B"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              minTickGap={40}
            />

            <YAxis
              domain={[0, 100]}
              stroke="#94A3B8"
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

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
              stroke="#38BDF8"
              strokeWidth={3}
              dot={false}
              name="RSI"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
      )}
<br></br>
    </div>

  );

};

export default MarketChart;
