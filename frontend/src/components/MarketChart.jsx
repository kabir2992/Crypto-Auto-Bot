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
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const MarketChart = ({ chartData }) => {
    return (
        <div className=" bg-[#0B1120] rounded-3xl p-6 shadow-2xl border border-white/10 mb-8 ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">SOLUSDT LIVE MARKET</h2>
                    <p className="text-gray-400 mt-1">Real-time Binance Testnet Data</p>
                </div>
            </div>
            <div className="h-[400px]">

                <ResponsiveContainer offset="5%" stopColor="#6366F1" stopOpacity={0.8} >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1" >
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="time" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" domain={["auto", "auto"]} />
                        <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "16px", border: "1px solid #334155" }} />
                        <Area type="monotone" dataKey="close" stroke="#818CF8" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MarketChart;