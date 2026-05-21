import { useEffect, useMemo, useState } from "react";

import API from "../api/axios";

import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

const TradeHistory = () => {

  const [trades, setTrades] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD TRADES
  // =========================================

  useEffect(() => {

    let mounted = true;

    const loadTrades = async () => {

      try {

        const response = await API.get("/trades");

        if (mounted)
        {
          setTrades(response.data || []);
        }

      }
      catch (error)
      {
        console.log("Trade History Error:", error);
      }
      finally
      {
        setLoading(false);
      }

    };

    loadTrades();

    const interval = setInterval(loadTrades, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };

  }, []);

  // =========================================
  // STATS
  // =========================================

  const stats = useMemo(() => {

    const totalTrades = trades.length;

    const buyTrades = trades.filter(t => t.side === "BUY").length;

    const sellTrades = trades.filter(t => t.side === "SELL").length;

    const totalProfit = trades.reduce((acc, trade) => {
      return acc + Number(trade.profit || 0);
    }, 0);

    return {
      totalTrades,
      buyTrades,
      sellTrades,
      totalProfit
    };

  }, [trades]);

  // =========================================
  // GROUP BY DATE
  // =========================================

  const groupedTrades = useMemo(() => {

    return trades.reduce((groups, trade) => {

      const date = new Date(trade.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      if (!groups[date])
      {
        groups[date] = [];
      }

      groups[date].push(trade);

      return groups;

    }, {});

  }, [trades]);

  return (

    <div className="min-h-screen bg-[#050816] text-white p-6">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-10">

        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

          Trade History

        </h1>

        <p className="text-gray-400 mt-3 text-lg">

          Complete trading activity & execution history

        </p>

      </div>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-400 text-sm">Total Trades</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.totalTrades}
              </h2>
            </div>

            <Activity className="text-cyan-400 w-10 h-10" />

          </div>

        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 backdrop-blur-xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-300 text-sm">BUY Orders</p>
              <h2 className="text-3xl font-bold mt-2 text-green-400">
                {stats.buyTrades}
              </h2>
            </div>

            <ArrowDownLeft className="text-green-400 w-10 h-10" />

          </div>

        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 backdrop-blur-xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-300 text-sm">SELL Orders</p>
              <h2 className="text-3xl font-bold mt-2 text-red-400">
                {stats.sellTrades}
              </h2>
            </div>

            <ArrowUpRight className="text-red-400 w-10 h-10" />

          </div>

        </div>

        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-300 text-sm">Net Profit</p>

              <h2 className={`text-3xl font-bold mt-2 ${
                stats.totalProfit >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}>

                ${stats.totalProfit.toFixed(2)}

              </h2>

            </div>

            {
              stats.totalProfit >= 0
                ? <TrendingUp className="text-green-400 w-10 h-10" />
                : <TrendingDown className="text-red-400 w-10 h-10" />
            }

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* TRADE GROUPS */}
      {/* ========================================= */}

      {
        loading ? (

          <div className="text-center text-gray-400 py-20 text-xl">
            Loading Trade History...
          </div>

        ) : Object.keys(groupedTrades).length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center">

            <Wallet className="mx-auto mb-5 w-14 h-14 text-gray-500" />

            <h2 className="text-2xl font-bold text-gray-300">
              No Trades Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your completed trades will appear here
            </p>

          </div>

        ) : (

          Object.entries(groupedTrades).map(([date, items]) => (

            <div key={date} className="mb-10">

              {/* DATE HEADER */}

              <div className="flex items-center gap-4 mb-5">

                <div className="h-px flex-1 bg-white/10"></div>

                <h2 className="text-xl font-bold text-cyan-300">
                  {date}
                </h2>

                <div className="h-px flex-1 bg-white/10"></div>

              </div>

              {/* TABLE */}

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-white/5 border-b border-white/10">

                      <tr className="text-left">

                        <th className="px-6 py-5 text-gray-400 font-semibold">
                          Type
                        </th>

                        <th className="px-6 py-5 text-gray-400 font-semibold">
                          Quantity
                        </th>

                        <th className="px-6 py-5 text-gray-400 font-semibold">
                          Price
                        </th>

                        <th className="px-6 py-5 text-gray-400 font-semibold">
                          Profit
                        </th>

                        <th className="px-6 py-5 text-gray-400 font-semibold">
                          Status
                        </th>

                        <th className="px-6 py-5 text-gray-400 font-semibold">
                          Time
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        items.map((trade) => {

                          const isBuy = trade.side === "BUY";

                          return (

                            <tr
                              key={trade._id}
                              className="border-b border-white/5 hover:bg-white/[0.03] transition"
                            >

                              <td className="px-6 py-5">

                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${
                                  isBuy
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>

                                  {
                                    isBuy
                                      ? <ArrowDownLeft size={16} />
                                      : <ArrowUpRight size={16} />
                                  }

                                  {trade.side}

                                </div>

                              </td>

                              <td className="px-6 py-5 font-semibold">

                                {Number(trade.quantity).toFixed(4)}

                              </td>

                              <td className="px-6 py-5 font-semibold text-cyan-300">

                                ${Number(trade.price).toFixed(2)}

                              </td>

                              <td className={`px-6 py-5 font-bold ${
                                Number(trade.profit) >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}>

                                ${Number(trade.profit || 0).toFixed(2)}

                              </td>

                              <td className="px-6 py-5">

                                <span className="px-3 py-1 rounded-xl text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">

                                  {trade.status}

                                </span>

                              </td>

                              <td className="px-6 py-5 text-gray-400">

                                {
                                  new Date(trade.createdAt).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    }
                                  )
                                }

                              </td>

                            </tr>

                          );

                        })
                      }

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          ))

        )
      }

    </div>

  );

};

export default TradeHistory;