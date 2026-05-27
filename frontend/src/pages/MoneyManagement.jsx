import { useState } from "react";
import { motion } from "framer-motion";

import MainLayout from "../layouts/MainLayout";
import useDashboardData from "../hooks/useDashboardData";
import useLivePrice from "../hooks/useLivePrice";
import CoinLoader from "../components/loaders/CoinLoader";
import AnalysisTimer from "../components/AnalysisTimer";
import BalanceCard from "../components/money/BalanceCard";
import PortfolioCard from "../components/money/PortfolioCard";
import ProfitCard from "../components/money/ProfitCard";
import AddFundsModal from "../components/money/AddFundsModal";
import API from "../api/axios";

const MoneyManagement = () => {
  const livePrice = useLivePrice();
  const { loading, botState, refreshDashboard } = useDashboardData();

  const [openModal,    setOpenModal]    = useState(false);
  const [addingFunds,  setAddingFunds]  = useState(false);
  const [successMsg,   setSuccessMsg]   = useState("");
  const [errorMsg,     setErrorMsg]     = useState("");

  if (loading) {
    return <CoinLoader message="LOADING PORTFOLIO MANAGEMENT..." />;
  }

  const availableBalance    = botState?.availableBalance    || 0;
  const solHolding          = botState?.solHolding          || 0;
  const averageBuyPrice     = botState?.averageBuyPrice     || 0;
  const totalInvestedAmount = botState?.totalInvestedAmount || 0;
  const totalBuyAmount      = botState?.totalBuyAmount      || 0;
  const totalSellAmount     = botState?.totalSellAmount     || 0;
  const totalProfit         = botState?.totalProfit         || 0;
  const realTotalProfit     = botState?.realTotalProfit     || 0;
  const totalLoss           = botState?.totalLoss           || 0;
  const currentHoldingValue = solHolding * livePrice;
  const totalPortfolioValue = availableBalance + currentHoldingValue;
  const profitPercentage    = totalInvestedAmount > 0 ? (realTotalProfit / totalInvestedAmount) * 100 : 0;

  // ── ADD FUNDS ─────────────────────────────────────────────────────────────
  const handleAddFunds = async (amount) => {
    try {
      setAddingFunds(true);
      setErrorMsg("");

      // POST to backend — increments availableBalance in botState document
      await API.post("/bot/add-balance", { amount });

      setSuccessMsg(`+$${Number(amount).toFixed(2)} added successfully!`);
      setOpenModal(false);

      // Refresh dashboard data so balance updates immediately
      await refreshDashboard();

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to add funds. Try again.");
    } finally {
      setAddingFunds(false);
    }
  };

  return (
    <MainLayout>

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">

          <div>
            <h1 className="text-4xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Money Management
            </h1>
            <p className="mt-3 text-slate-400 text-lg max-w-3xl leading-8">
              Track your live balance, investment capital, profit & loss,
              portfolio value and risk exposure with institutional-level financial analytics.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl px-6 py-5 shadow-2xl">
              <p className="text-xs uppercase tracking-widest text-emerald-300 mb-2">Live SOLUSDT</p>
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

      {/* ── SUCCESS MESSAGE ── */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-emerald-300 font-semibold flex items-center gap-3"
        >
          <span className="text-xl">✅</span> {successMsg}
        </motion.div>
      )}

      {/* ── ERROR MESSAGE ── */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-300 font-semibold flex items-center gap-3"
        >
          <span className="text-xl">❌</span> {errorMsg}
        </motion.div>
      )}

      {/* ── INSUFFICIENT BALANCE WARNING ── */}
      {availableBalance < 10 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-red-400">⚠️ Insufficient Balance Warning</h2>
              <p className="mt-2 text-slate-300 leading-7">
                Your balance has dropped below $10. Trading operations may stop soon.
                Please add funds to continue stable trading execution.
              </p>
            </div>
            <button
              onClick={() => setOpenModal(true)}
              className="px-6 py-4 rounded-2xl bg-red-500 hover:bg-red-400 transition-all duration-300 text-white font-black shadow-2xl whitespace-nowrap"
            >
              Add Funds Now
            </button>
          </div>
        </motion.div>
      )}

      {/* ── TOP CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
        <BalanceCard
          balance={availableBalance}
          livePrice={livePrice}
          warning={availableBalance < 10}
        />
        <PortfolioCard
          totalInvested={totalInvestedAmount}
          solHolding={solHolding}
          currentHoldingValue={currentHoldingValue}
          averageBuyPrice={averageBuyPrice}
        />
        <ProfitCard
          realTotalProfit={realTotalProfit}
          totalProfit={totalProfit}
          totalLoss={totalLoss}
          totalInvestedAmount={totalInvestedAmount}
          profitPercentage={profitPercentage}
        />
      </div>

      {/* ── PORTFOLIO INTELLIGENCE ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl mb-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">Portfolio Intelligence</h2>
            <p className="text-slate-400 mt-2">Deep financial metrics of your AI trading account</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-cyan-300 font-bold">
            LIVE TRACKING
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: "Total Invested (Total Buy + Total Sell)",  value: `$${totalInvestedAmount.toFixed(2)}`, color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/10"   },
            { label: "SOL Holdings",    value: solHolding.toFixed(4),                color: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-500/10" },
            { label: "Average Buy",     value: `$${averageBuyPrice.toFixed(2)}`,     color: "text-emerald-400",border: "border-emerald-500/20",bg: "bg-emerald-500/10"},
            { label: "Holding Value",   value: `$${currentHoldingValue.toFixed(2)}`, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/10" },
            { label: "Total Buy",       value: `$${totalBuyAmount.toFixed(2)}`,      color: "text-cyan-400",   border: "border-cyan-500/20",   bg: "bg-cyan-500/10"   },
            { label: "Total Sell",      value: `$${totalSellAmount.toFixed(2)}`,     color: "text-emerald-400",border: "border-emerald-500/20",bg: "bg-emerald-500/10" },
          ].map((s) => (
            <div key={s.label} className={`rounded-3xl border ${s.border} ${s.bg} p-6`}>
              <p className="text-slate-400 mb-3">{s.label}</p>
              <h2 className={`text-3xl font-black ${s.color}`}>{s.value}</h2>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── ADD FUNDS BUTTON ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <button
          onClick={() => setOpenModal(true)}
          className="px-10 py-5 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 text-white font-black text-lg shadow-[0_0_60px_rgba(6,182,212,0.35)]"
        >
          + Add New Funds
        </button>
      </motion.div>

      {/* ── MODAL ── */}
      <AddFundsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAddFunds={handleAddFunds}        
        loading={addingFunds}              
      />

    </MainLayout>
  );
};

export default MoneyManagement;