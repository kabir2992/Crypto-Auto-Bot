import { motion } from "framer-motion";

import {

  BrainCircuit,

  ShieldAlert,

  Target,

  TrendingUp,

  TrendingDown,

  Activity,

  BadgeDollarSign,

  Sparkles

} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

import useDashboardData from "../hooks/useDashboardData";

import AnalysisTimer from "../components/AnalysisTimer";

const AIAnalytics = () => {

  const {

    aiData,

    livePrice,

    botState,

    chartData

  } = useDashboardData();

  const latestCandle =
    chartData[
      chartData.length - 1
    ];

  const currentRSI =
    latestCandle?.rsi || 0;

  const marketTrend =
    aiData?.marketTrend || "UNKNOWN";

  const decision =
    aiData?.decision || "HOLD";

  const confidence =
    aiData?.confidence || 0;

  const riskLevel =
    aiData?.riskLevel || "LOW";

  const trendColor =
    marketTrend === "BULLISH"
      ? "text-green-400"
      : marketTrend === "BEARISH"
      ? "text-red-400"
      : "text-yellow-400";

  const decisionColor =
    decision === "BUY"
      ? "text-green-400"
      : decision === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  return (

    <MainLayout>

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
          mb-10
        "
      >

        <div>

          <h1 className="
            text-5xl
            font-black
            bg-gradient-to-r
            from-purple-400
            to-pink-500
            bg-clip-text
            text-transparent
          ">

            AI Analytics

          </h1>

          <p className="
            text-gray-400
            mt-3
            text-lg
          ">

            Real-time AI generated crypto intelligence engine

          </p>

        </div>

        <AnalysisTimer
          nextAnalysisTime={
            botState?.nextAnalysisTime
          }
          lastAction={
            botState?.lastAction
          }
        />

      </motion.div>

      {/* TOP GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
      ">

        {/* AI DECISION */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            rounded-3xl
            p-6
            border
            border-white/10
            bg-gradient-to-br
            from-cyan-500/10
            to-blue-500/5
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">

            <p className="
              text-gray-400
            ">

              AI Decision

            </p>

            <BrainCircuit
              className="
                text-cyan-400
              "
            />

          </div>

          <h2 className={`
            text-5xl
            font-black
            ${decisionColor}
          `}>

            {decision}

          </h2>

        </motion.div>

        {/* CONFIDENCE */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            rounded-3xl
            p-6
            border
            border-white/10
            bg-gradient-to-br
            from-purple-500/10
            to-pink-500/5
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">

            <p className="
              text-gray-400
            ">

              Confidence

            </p>

            <Sparkles
              className="
                text-purple-400
              "
            />

          </div>

          <h2 className="
            text-5xl
            font-black
            text-purple-400
          ">

            {confidence}%

          </h2>

        </motion.div>

        {/* MARKET TREND */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            rounded-3xl
            p-6
            border
            border-white/10
            bg-gradient-to-br
            from-green-500/10
            to-emerald-500/5
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">

            <p className="
              text-gray-400
            ">

              Market Trend

            </p>

            {
              marketTrend === "BULLISH"
                ? (
                  <TrendingUp
                    className="
                      text-green-400
                    "
                  />
                )
                : (
                  <TrendingDown
                    className="
                      text-red-400
                    "
                  />
                )
            }

          </div>

          <h2 className={`
            text-4xl
            font-black
            ${trendColor}
          `}>

            {marketTrend}

          </h2>

        </motion.div>

        {/* RISK */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            rounded-3xl
            p-6
            border
            border-white/10
            bg-gradient-to-br
            from-red-500/10
            to-orange-500/5
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">

            <p className="
              text-gray-400
            ">

              Risk Level

            </p>

            <ShieldAlert
              className="
                text-red-400
              "
            />

          </div>

          <h2 className="
            text-4xl
            font-black
            text-red-400
          ">

            {riskLevel}

          </h2>

        </motion.div>

      </div>

      {/* PRICE TARGETS */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        mb-10
      ">

        {/* ENTRY */}

        <div className="
          rounded-3xl
          p-8
          border
          border-green-400/20
          bg-green-500/10
          backdrop-blur-xl
          shadow-2xl
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-5
          ">

            <BadgeDollarSign
              className="
                text-green-400
              "
            />

            <h2 className="
              text-2xl
              font-black
            ">

              Recommended Entry

            </h2>

          </div>

          <h3 className="
            text-5xl
            font-black
            text-green-400
          ">

            ${aiData?.recommendedEntry || 0}

          </h3>

        </div>

        {/* STOP LOSS */}

        <div className="
          rounded-3xl
          p-8
          border
          border-red-400/20
          bg-red-500/10
          backdrop-blur-xl
          shadow-2xl
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-5
          ">

            <ShieldAlert
              className="
                text-red-400
              "
            />

            <h2 className="
              text-2xl
              font-black
            ">

              Stop Loss

            </h2>

          </div>

          <h3 className="
            text-5xl
            font-black
            text-red-400
          ">

            ${aiData?.recommendedStopLoss || 0}

          </h3>

        </div>

        {/* TAKE PROFIT */}

        <div className="
          rounded-3xl
          p-8
          border
          border-cyan-400/20
          bg-cyan-500/10
          backdrop-blur-xl
          shadow-2xl
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-5
          ">

            <Target
              className="
                text-cyan-400
              "
            />

            <h2 className="
              text-2xl
              font-black
            ">

              Take Profit

            </h2>

          </div>

          <h3 className="
            text-5xl
            font-black
            text-cyan-400
          ">

            ${aiData?.recommendedTakeProfit || 0}

          </h3>

        </div>

      </div>

      {/* AI STRATEGY */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
          rounded-3xl
          p-8
          bg-[#0B1120]
          border
          border-white/10
          backdrop-blur-xl
          shadow-2xl
          mb-10
        "
      >

        <div className="
          flex
          items-center
          gap-4
          mb-8
        ">

          <Activity
            className="
              text-yellow-400
            "
            size={30}
          />

          <div>

            <h2 className="
              text-3xl
              font-black
            ">

              AI Strategy Engine

            </h2>

            <p className="
              text-gray-400
            ">

              Current active AI trading strategy

            </p>

          </div>

        </div>

        <div className="
          rounded-3xl
          p-8
          bg-gradient-to-r
          from-yellow-500/10
          to-orange-500/5
          border
          border-yellow-400/20
        ">

          <h2 className="
            text-4xl
            font-black
            text-yellow-400
            mb-4
          ">

            {aiData?.strategy || "NO STRATEGY"}

          </h2>

          <p className="
            text-gray-300
            text-lg
            leading-8
          ">

            {
              aiData?.summary ||
              "No AI summary available."
            }

          </p>

        </div>

      </motion.div>

      {/* AI REASONING */}

      <motion.div
        initial={{
          opacity: 0,
          y: 50
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
          rounded-3xl
          p-8
          bg-[#0B1120]
          border
          border-white/10
          backdrop-blur-xl
          shadow-2xl
        "
      >

        <div className="
          flex
          items-center
          gap-4
          mb-8
        ">

          <BrainCircuit
            className="
              text-cyan-400
            "
            size={30}
          />

          <div>

            <h2 className="
              text-3xl
              font-black
            ">

              AI Reasoning

            </h2>

            <p className="
              text-gray-400
            ">

              Why the AI selected this strategy

            </p>

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

                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.02
                  }}
                  className="
                    rounded-3xl
                    p-6
                    bg-white/5
                    border
                    border-white/10
                    text-gray-300
                    leading-8
                  "
                >

                  <div className="
                    flex
                    items-start
                    gap-4
                  ">

                    <div className="
                      w-10
                      h-10
                      rounded-full
                      bg-cyan-500/20
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-cyan-400
                      shrink-0
                    ">

                      {index + 1}

                    </div>

                    <p>

                      {reason}

                    </p>

                  </div>

                </motion.div>

              )
            )
          }

        </div>

      </motion.div>

    </MainLayout>

  );

};

export default AIAnalytics;