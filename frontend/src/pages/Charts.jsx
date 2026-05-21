import { motion } from "framer-motion";

import MainLayout from "../layouts/MainLayout";

import useDashboardData from "../hooks/useDashboardData";

import MarketChart from "../components/MarketChart";

import AnalysisTimer from "../components/AnalysisTimer";

import {
  TrendingUp,
  TrendingDown,
  Activity,
  BrainCircuit,
  Waves
} from "lucide-react";

const Charts = () => {

  const {

    botState,

    chartData,

    livePrice,

    aiData

  } = useDashboardData();

  const latestCandle =
    chartData[
      chartData.length - 1
    ];

  const ema20 =
    latestCandle?.ema20 || 0;

  const ema50 =
    latestCandle?.ema50 || 0;

  const rsi =
    latestCandle?.rsi || 0;

  const trend =
    ema20 > ema50
      ? "Bullish"
      : "Bearish";

  const marketStrength =
    Math.abs(ema20 - ema50);

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
          mb-8
        "
      >

        <div>

          <h1 className="
            text-5xl
            font-black
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
            bg-clip-text
            text-transparent
          ">

            Advanced Charts

          </h1>

          <p className="
            text-gray-400
            mt-3
            text-lg
          ">

            Live AI Market Analysis for SOLUSDT

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

      {/* LIVE STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-5
        gap-6
        mb-8
      ">

        {/* LIVE PRICE */}

        <motion.div
          whileHover={{
            scale: 1.02
          }}
          className="
            bg-gradient-to-br
            from-green-500/10
            to-green-500/5
            border
            border-green-400/20
            rounded-3xl
            p-6
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">

            <p className="
              text-gray-400
              text-sm
            ">

              Live Price

            </p>

            <Activity
              className="
                text-green-400
              "
            />

          </div>

          <h2 className="
            text-4xl
            font-black
            text-green-400
          ">

            ${Number(livePrice).toFixed(2)}

          </h2>

        </motion.div>

        {/* TREND */}

        <motion.div
          whileHover={{
            scale: 1.02
          }}
          className="
            bg-gradient-to-br
            from-cyan-500/10
            to-blue-500/5
            border
            border-cyan-400/20
            rounded-3xl
            p-6
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">

            <p className="
              text-gray-400
              text-sm
            ">

              Market Trend

            </p>

            {
              trend === "Bullish"
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
            ${
              trend === "Bullish"
                ? "text-green-400"
                : "text-red-400"
            }
          `}>

            {trend}

          </h2>

        </motion.div>

        {/* RSI */}

        <motion.div
          whileHover={{
            scale: 1.02
          }}
          className="
            bg-gradient-to-br
            from-yellow-500/10
            to-orange-500/5
            border
            border-yellow-400/20
            rounded-3xl
            p-6
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">

            <p className="
              text-gray-400
              text-sm
            ">

              RSI Index

            </p>

            <Waves
              className="
                text-yellow-400
              "
            />

          </div>

          <h2 className="
            text-4xl
            font-black
            text-yellow-400
          ">

            {rsi.toFixed(2)}

          </h2>

        </motion.div>

        {/* AI CONFIDENCE */}

        <motion.div
          whileHover={{
            scale: 1.02
          }}
          className="
            bg-gradient-to-br
            from-purple-500/10
            to-pink-500/5
            border
            border-purple-400/20
            rounded-3xl
            p-6
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">

            <p className="
              text-gray-400
              text-sm
            ">

              AI Confidence

            </p>

            <BrainCircuit
              className="
                text-purple-400
              "
            />

          </div>

          <h2 className="
            text-4xl
            font-black
            text-purple-400
          ">

            {aiData?.confidence || 0}%

          </h2>

        </motion.div>

        {/* MARKET STRENGTH */}

        <motion.div
          whileHover={{
            scale: 1.02
          }}
          className="
            bg-gradient-to-br
            from-pink-500/10
            to-rose-500/5
            border
            border-pink-400/20
            rounded-3xl
            p-6
            backdrop-blur-xl
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">

            <p className="
              text-gray-400
              text-sm
            ">

              EMA Strength

            </p>

            <Activity
              className="
                text-pink-400
              "
            />

          </div>

          <h2 className="
            text-4xl
            font-black
            text-pink-400
          ">

            {marketStrength.toFixed(2)}

          </h2>

        </motion.div>

      </div>

      {/* CHART */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.2
        }}
      >

        <MarketChart
          chartData={chartData}
          botState={botState}
        />

      </motion.div>

      {/* AI MARKET SUMMARY */}

      <motion.div
        initial={{
          opacity: 0,
          y: 50
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.3
        }}
        className="
          mt-8
          bg-[#0B1120]
          border
          border-white/10
          rounded-3xl
          p-8
          shadow-2xl
          backdrop-blur-xl
        "
      >

        <div className="
          flex
          items-center
          gap-4
          mb-6
        ">

          <BrainCircuit
            size={30}
            className="
              text-cyan-400
            "
          />

          <div>

            <h2 className="
              text-3xl
              font-black
            ">

              AI Market Intelligence

            </h2>

            <p className="
              text-gray-400
            ">

              Real-time AI generated market insights

            </p>

          </div>

        </div>

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">

          {/* LEFT */}

          <div className="
            bg-white/5
            rounded-3xl
            p-6
            border
            border-white/10
          ">

            <h3 className="
              text-xl
              font-bold
              mb-4
              text-cyan-300
            ">

              AI Summary

            </h3>

            <p className="
              text-gray-300
              leading-8
              text-lg
            ">

              {
                aiData?.summary ||
                "No AI summary available."
              }

            </p>

          </div>

          {/* RIGHT */}

          <div className="
            bg-white/5
            rounded-3xl
            p-6
            border
            border-white/10
          ">

            <h3 className="
              text-xl
              font-bold
              mb-4
              text-purple-300
            ">

              AI Reasons

            </h3>

            <div className="
              space-y-4
            ">

              {
                aiData?.reason?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="
                        p-4
                        rounded-2xl
                        bg-black/20
                        border
                        border-white/5
                        text-gray-300
                      "
                    >

                      {item}

                    </div>

                  )
                )
              }

            </div>

          </div>

        </div>

      </motion.div>

    </MainLayout>

  );

};

export default Charts;