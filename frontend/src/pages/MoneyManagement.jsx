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

const MoneyManagement = () => {

  const {

    loading,

    botState,

    livePrice = useLivePrice(),

    chartData

  } = useDashboardData();

  const [openModal, setOpenModal] =
    useState(false);

  if (loading)
  {
    return (
      <CoinLoader
        message="LOADING PORTFOLIO MANAGEMENT..."
      />
    );
  }

  const availableBalance =
    botState?.availableBalance || 0;

  const solHolding =
    botState?.solHolding || 0;

  const averageBuyPrice =
    botState?.averageBuyPrice || 0;

  const totalInvestedAmount =
    botState?.totalInvestedAmount || 0;

  const totalProfit =
    botState?.totalProfit || 0;

  const totalLoss =
    botState?.totalLoss || 0;

  const currentHoldingValue =
    solHolding * livePrice;

  const totalPortfolioValue =
    availableBalance + currentHoldingValue;

  const profitPercentage =
    totalInvestedAmount > 0
      ? (
          (totalProfit / totalInvestedAmount) * 100
        )
      : 0;

  return (

    <MainLayout>

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
          mb-10
        "
      >

        <div className="
          flex
          flex-col
          2xl:flex-row
          2xl:items-center
          2xl:justify-between
          gap-6
        ">

          {/* LEFT */}

          <div>

            <h1 className="
              text-4xl
              md:text-5xl
              font-black
              bg-gradient-to-r
              from-emerald-400
              via-cyan-500
              to-blue-500
              bg-clip-text
              text-transparent
            ">

              Money Management

            </h1>

            <p className="
              mt-3
              text-slate-400
              text-lg
              max-w-3xl
              leading-8
            ">

              Track your live balance, investment capital,
              profit & loss, portfolio value and risk exposure
              with institutional-level financial analytics.

            </p>

          </div>

          {/* RIGHT */}

          <div className="
            flex
            flex-col
            lg:flex-row
            gap-4
          ">

            {/* LIVE PRICE */}

            <div className="
              rounded-3xl
              border
              border-emerald-500/20
              bg-emerald-500/10
              backdrop-blur-xl
              px-6
              py-5
              shadow-2xl
            ">

              <p className="
                text-xs
                uppercase
                tracking-widest
                text-emerald-300
                mb-2
              ">

                Live SOLUSDT

              </p>

              <h2 className="
                text-4xl
                font-black
                text-emerald-400
              ">

                $
                {
                  Number(
                    livePrice || 0
                  ).toFixed(2)
                }

              </h2>

            </div>

            {/* ANALYSIS TIMER */}

            <AnalysisTimer
              nextAnalysisTime={
                botState?.nextAnalysisTime
              }
              lastAction={
                botState?.lastAction
              }
            />

          </div>

        </div>

      </motion.div>

      {/* WARNING */}

      {
        availableBalance < 10 && (

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="
              mb-8
              rounded-3xl
              border
              border-red-500/30
              bg-red-500/10
              backdrop-blur-xl
              p-6
              shadow-2xl
            "
          >

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-black
                  text-red-400
                ">

                  Insufficient Balance Warning

                </h2>

                <p className="
                  mt-2
                  text-slate-300
                  leading-7
                ">

                  Your balance has dropped below
                  $10. Trading operations may stop soon.
                  Please add funds to continue stable
                  trading execution.

                </p>

              </div>

              <button
                onClick={() =>
                  setOpenModal(true)
                }
                className="
                  px-6
                  py-4
                  rounded-2xl
                  bg-red-500
                  hover:bg-red-400
                  transition-all
                  duration-300
                  text-white
                  font-black
                  shadow-2xl
                "
              >

                Add Funds

              </button>

            </div>

          </motion.div>

        )
      }

      {/* TOP CARDS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-8
        mb-10
      ">

        <BalanceCard
          balance={availableBalance}
          livePrice={livePrice}
          warning={
            availableBalance < 10
          }
        />

        <PortfolioCard
          solHolding={solHolding}
          currentHoldingValue={
            currentHoldingValue
          }
          averageBuyPrice={
            averageBuyPrice
          }
          totalPortfolioValue={
            totalPortfolioValue
          }
        />

        <ProfitCard
          totalProfit={totalProfit}
          totalLoss={totalLoss}
          totalInvestedAmount={
            totalInvestedAmount
          }
          profitPercentage={
            profitPercentage
          }
        />

      </div>

      {/* ADVANCED STATS */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.15
        }}
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          p-8
          shadow-2xl
          mb-10
        "
      >

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <div>

            <h2 className="
              text-3xl
              font-black
              text-white
            ">

              Portfolio Intelligence

            </h2>

            <p className="
              text-slate-400
              mt-2
            ">

              Deep financial metrics of your AI trading account

            </p>

          </div>

          <div className="
            rounded-2xl
            border
            border-cyan-500/20
            bg-cyan-500/10
            px-5
            py-3
            text-cyan-300
            font-bold
          ">

            LIVE TRACKING

          </div>

        </div>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        ">

          {/* TOTAL INVESTED */}

          <div className="
            rounded-3xl
            border
            border-blue-500/20
            bg-blue-500/10
            p-6
          ">

            <p className="
              text-slate-400
              mb-3
            ">

              Total Invested

            </p>

            <h2 className="
              text-3xl
              font-black
              text-blue-400
            ">

              $
              {
                totalInvestedAmount.toFixed(2)
              }

            </h2>

          </div>

          {/* HOLDING VALUE */}

          <div className="
            rounded-3xl
            border
            border-purple-500/20
            bg-purple-500/10
            p-6
          ">

            <p className="
              text-slate-400
              mb-3
            ">

              Holding Value

            </p>

            <h2 className="
              text-3xl
              font-black
              text-purple-400
            ">

              $
              {
                currentHoldingValue.toFixed(2)
              }

            </h2>

          </div>

          {/* SOL HOLDING */}

          <div className="
            rounded-3xl
            border
            border-orange-500/20
            bg-orange-500/10
            p-6
          ">

            <p className="
              text-slate-400
              mb-3
            ">

              SOL Holdings

            </p>

            <h2 className="
              text-3xl
              font-black
              text-orange-400
            ">

              {
                solHolding.toFixed(4)
              }

            </h2>

          </div>

          {/* AVG BUY */}

          <div className="
            rounded-3xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            p-6
          ">

            <p className="
              text-slate-400
              mb-3
            ">

              Average Buy

            </p>

            <h2 className="
              text-3xl
              font-black
              text-emerald-400
            ">

              $
              {
                averageBuyPrice.toFixed(2)
              }

            </h2>

          </div>

        </div>

      </motion.div>

      {/* ADD FUNDS BUTTON */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.2
        }}
        className="
          flex
          justify-center
        "
      >

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="
            px-10
            py-5
            rounded-3xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            hover:scale-105
            transition-all
            duration-300
            text-white
            font-black
            text-lg
            shadow-[0_0_60px_rgba(6,182,212,0.35)]
          "
        >

          Add New Funds

        </button>

      </motion.div>

      {/* MODAL */}

      <AddFundsModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
      />

    </MainLayout>

  );

};

export default MoneyManagement;