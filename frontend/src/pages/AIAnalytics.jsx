import { motion } from "framer-motion";

import MainLayout from "../layouts/MainLayout";

import useDashboardData from "../hooks/useDashboardData";

import AnalysisTimer from "../components/AnalysisTimer";

import AIOverviewCard from "../components/ai/AIOverviewCard";

import AIConfidenceBar from "../components/ai/AIConfidenceBar";

import AITradeLevel from "../components/ai/AITradeLevels";

import AIReasonCard from "../components/ai/AIReasonCard";

import AIStrategyCard from "../components/ai/AIStrategyCard";

import CoinLoader from "../components/loaders/CoinLoader";

const AIAnalytics = () => {

  const {

    loading,

    aiData,

    botState,

    livePrice,

    chartData

  } = useDashboardData();

  if (loading)
  {
    return (
      <CoinLoader
        message="INITIALIZING AI ANALYTICS ENGINE..."
      />
    );
  }

  const latestCandle =
    chartData?.[
      chartData.length - 1
    ];

  const currentRSI =
    latestCandle?.rsi || 0;

  const marketTrend =
    aiData?.marketTrend || "UNKNOWN";

  const liveFormattedPrice =
    Number(livePrice || 0).toFixed(2);

  return (

    <MainLayout>

      {/* PAGE HEADER */}

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
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
        ">

          {/* LEFT */}

          <div>

            <h1 className="
              text-4xl
              md:text-5xl
              font-black
              bg-gradient-to-r
              from-cyan-400
              via-blue-500
              to-purple-500
              bg-clip-text
              text-transparent
            ">

              AI Analytics

            </h1>

            <p className="
              mt-3
              text-slate-400
              text-lg
              max-w-2xl
              leading-8
            ">

              Real-time AI intelligence engine analyzing
              SOLUSDT market conditions, strategy confidence,
              trend reversals and institutional trading signals.

            </p>

          </div>

          {/* RIGHT */}

          <div className="
            flex
            flex-col
            md:flex-row
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

                ${liveFormattedPrice}

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

      {/* TOP OVERVIEW GRID */}

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
          delay: 0.1
        }}
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          2xl:grid-cols-4
          gap-6
          mb-10
        "
      >

        <AIOverviewCard
          title="AI Decision"
          value={aiData?.decision || "HOLD"}
          type="decision"
        />

        <AIOverviewCard
          title="Market Trend"
          value={marketTrend}
          type="trend"
        />

        <AIOverviewCard
          title="Risk Level"
          value={aiData?.riskLevel || "LOW"}
          type="risk"
        />

        <AIOverviewCard
          title="Current RSI"
          value={currentRSI.toFixed(2)}
          type="rsi"
        />

      </motion.div>

      {/* CONFIDENCE + STRATEGY */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        mb-10
      ">

        <AIConfidenceBar
          confidence={
            aiData?.confidence || 0
          }
          strategy={
            aiData?.strategy
          }
        />

        <AIStrategyCard
          strategy={
            aiData?.strategy
          }
          summary={
            aiData?.summary
          }
          trend={
            marketTrend
          }
        />

      </div>

      {/* TRADE LEVELS */}

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
          delay: 0.2
        }}
        className="
          mb-10
        "
      >

        <h2 className="
          text-3xl
          font-black
          text-white
          mb-6
        ">

          AI Trade Levels

        </h2>

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        ">

          <AITradeLevel
            title="Recommended Entry"
            value={
              aiData?.recommendedEntry
            }
            type="entry"
          />

          <AITradeLevel
            title="Stop Loss"
            value={
              aiData?.recommendedStopLoss
            }
            type="stoploss"
          />

          <AITradeLevel
            title="Take Profit"
            value={
              aiData?.recommendedTakeProfit
            }
            type="takeprofit"
          />

        </div>

      </motion.div>

      {/* AI REASONING */}

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
          delay: 0.3
        }}
      >

        <div className="
          flex
          items-center
          justify-between
          gap-4
          mb-8
        ">

          <div>

            <h2 className="
              text-3xl
              font-black
              text-white
            ">

              AI Reasoning Engine

            </h2>

            <p className="
              text-slate-400
              mt-2
            ">

              Why the AI selected this exact strategy

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

            {
              aiData?.reason?.length || 0
            } Insights

          </div>

        </div>

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">

          {
            aiData?.reason?.map(
              (reason, index) => (

                <AIReasonCard
                  key={index}
                  index={index}
                  reason={reason}
                />

              )
            )
          }

        </div>

      </motion.div>

    </MainLayout>

  );

};

export default AIAnalytics;