import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import MainLayout from "../layouts/MainLayout";

import useDashboardData from "../hooks/useDashboardData";

import useLivePrice from "../hooks/useLivePrice";

import CoinLoader from "../components/loaders/CoinLoader";

import AnalysisTimer from "../components/AnalysisTimer";

import TradeFilter from "../components/trades/TradeFilters";

import TradeTable from "../components/trades/TradeTable";

import SellGuardNotice from "../components/trades/SellGuardNotice";

const StatCard = ({ label, value, colorClass, borderClass, bgClass }) => (
  <div className={`rounded-3xl border ${borderClass} ${bgClass} backdrop-blur-xl p-6 shadow-2xl`}>
    <p className="text-slate-400 text-sm uppercase tracking-widest mb-3">{label}</p>
    <h2 className={`text-3xl font-black ${colorClass}`}>{value}</h2>
  </div>
);

const TradeHistory = () => {
  const livePrice = useLivePrice();

  const { loading, trades, botState } = useDashboardData();

  const [filter, setFilter] = useState("ALL");

  const filteredTrades = useMemo(() => {
    if (filter === "ALL") return trades;
    return trades.filter((trade) => trade.side === filter);
  }, [trades, filter]);

  const totalBuyTrades  = trades.filter((t) => t.side === "BUY").length;
  const totalSellTrades = trades.filter((t) => t.side === "SELL").length;

  const totalProfit = trades
    .filter((t) => t.side === "SELL")
    .reduce((acc, t) => acc + Number(t.profit || 0), 0);

  const totalVolume = trades.reduce(
    (acc, t) => acc + Number(t.quantity || 0), 0
  );

  if (loading) {
    return <CoinLoader message="LOADING TRADE HISTORY ENGINE..." />;
  }

  return (
    <MainLayout>

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Trade History
            </h1>
            <p className="mt-3 text-slate-400 text-lg max-w-3xl leading-8">
              Monitor every BUY and SELL execution, profit realization,
              volume flow and institutional AI trade performance in real-time.
            </p>
          </div>

          {/* RIGHT — live price + timer */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl px-6 py-5 shadow-2xl">
              <p className="text-xs uppercase tracking-widest text-emerald-300 mb-2">
                Live SOLUSDT
              </p>
              <h2 className="text-4xl font-black text-emerald-400">
                ${Number(livePrice || 0).toFixed(2)}
              </h2>
            </div>

            <AnalysisTimer
              nextAnalysisTime={botState?.nextAnalysisTime}
              lastAction={botState?.lastAction}
            />
          </div>

        </div>
      </motion.div>

      {/* ── TOP STAT CARDS ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
      >
        <StatCard
          label="Total Trades"
          value={trades.length}
          colorClass="text-cyan-400"
          borderClass="border-cyan-500/20"
          bgClass="bg-cyan-500/10"
        />
        <StatCard
          label="BUY Executions"
          value={totalBuyTrades}
          colorClass="text-emerald-400"
          borderClass="border-emerald-500/20"
          bgClass="bg-emerald-500/10"
        />
        <StatCard
          label="SELL Executions"
          value={totalSellTrades}
          colorClass="text-red-400"
          borderClass="border-red-500/20"
          bgClass="bg-red-500/10"
        />
        <StatCard
          label="Total Realized Profit"
          value={`$${totalProfit.toFixed(2)}`}
          colorClass="text-yellow-400"
          borderClass="border-yellow-500/20"
          bgClass="bg-yellow-500/10"
        />
      </motion.div>

      {/* ── ADVANCED OVERVIEW ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl mb-10"
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">Trade Intelligence</h2>
            <p className="mt-2 text-slate-400">
              Real-time execution analytics from your AI trading bot
            </p>
          </div>
          <TradeFilter filter={filter} setFilter={setFilter} />
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <p className="text-slate-400 mb-3">Total Trade Volume</p>
            <h2 className="text-3xl font-black text-cyan-400">
              {totalVolume.toFixed(4)} SOL
            </h2>
          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
            <p className="text-slate-400 mb-3">Last Bot Action</p>
            <h2 className="text-3xl font-black text-purple-400">
              {botState?.lastAction || "NONE"}
            </h2>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-slate-400 mb-3">Active Strategy</p>
            <h2 className="text-2xl font-black text-emerald-400 leading-tight">
              {botState?.currentStrategy || "NO STRATEGY"}
            </h2>
          </div>

        </div>
      </motion.div>

      {/* ── TRADE TABLE ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >

        <SellGuardNotice
          botState={botState}
          livePrice={livePrice}
        />

        <TradeTable trades={filteredTrades} />
      </motion.div>

    </MainLayout>
  );
};

export default TradeHistory;
