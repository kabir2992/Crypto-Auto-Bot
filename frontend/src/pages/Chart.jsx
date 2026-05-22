import { motion } from "framer-motion";

import MainLayout from "../layouts/MainLayout";

import useDashboardData from "../hooks/useDashboardData";

import useLivePrice from "../hooks/useLivePrice";

import CoinLoader from "../components/loaders/CoinLoader";

import AnalysisTimer from "../components/AnalysisTimer";

import MainChart from "../components/charts/MainChart";

import EMAChart from "../components/charts/EMAChart";

import RSIChart from "../components/charts/RSIChart";

import MACDChart from "../components/charts/MACDChart";

import VolumeChart from "../components/charts/VolumeChart";

const Chart = () => {

  const {

    loading,

    chartData,

    
    botState
    
} = useDashboardData();

const livePrice = useLivePrice();

  if (loading)
  {
    return (
      <CoinLoader
        message="LOADING ADVANCED MARKET CHARTS..."
      />
    );
  }

  const latestCandle =
    chartData?.[
      chartData.length - 1
    ];

//   const latestPrice =
//     latestCandle?.close || 0;

  const latestEMA20 =
    latestCandle?.ema20 || 0;

  const latestEMA50 =
    latestCandle?.ema50 || 0;

  const latestRSI =
    latestCandle?.rsi || 0;

  const trend =
    latestEMA20 > latestEMA50
      ? "BULLISH"
      : "BEARISH";

  const trendColor =
    trend === "BULLISH"
      ? "text-emerald-400"
      : "text-red-400";

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
              from-cyan-400
              via-blue-500
              to-purple-500
              bg-clip-text
              text-transparent
            ">

              Advanced Charts

            </h1>

            <p className="
              mt-3
              text-slate-400
              text-lg
              max-w-3xl
              leading-8
            ">

              Institutional-grade live crypto analytics dashboard
              powered by EMA, RSI, MACD and real-time SOLUSDT
              market intelligence.

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
                    livePrice
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

      {/* OVERVIEW CARDS */}

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
          delay: 0.1
        }}
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        "
      >

        {/* PRICE */}

        <div className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-cyan-500/10
          backdrop-blur-xl
          p-6
          shadow-2xl
        ">

          <p className="
            text-slate-400
            mb-3
          ">

            Current Price

          </p>

          <h2 className="
            text-4xl
            font-black
            text-cyan-400
          ">

            ${livePrice.toFixed(2)}

          </h2>

        </div>

        {/* EMA20 */}

        <div className="
          rounded-3xl
          border
          border-emerald-500/20
          bg-emerald-500/10
          backdrop-blur-xl
          p-6
          shadow-2xl
        ">

          <p className="
            text-slate-400
            mb-3
          ">

            EMA 20

          </p>

          <h2 className="
            text-4xl
            font-black
            text-emerald-400
          ">

            {latestEMA20.toFixed(4)}

          </h2>

        </div>

        {/* EMA50 */}

        <div className="
          rounded-3xl
          border
          border-orange-500/20
          bg-orange-500/10
          backdrop-blur-xl
          p-6
          shadow-2xl
        ">

          <p className="
            text-slate-400
            mb-3
          ">

            EMA 50

          </p>

          <h2 className="
            text-4xl
            font-black
            text-orange-400
          ">

            {latestEMA50.toFixed(4)}

          </h2>

        </div>

        {/* RSI */}

        <div className="
          rounded-3xl
          border
          border-purple-500/20
          bg-purple-500/10
          backdrop-blur-xl
          p-6
          shadow-2xl
        ">

          <p className="
            text-slate-400
            mb-3
          ">

            Current RSI

          </p>

          <h2 className={`
            text-4xl
            font-black
            ${trendColor}
          `}>

            {latestRSI.toFixed(2)}

          </h2>

        </div>

      </motion.div>

      {/* MAIN PRICE CHART */}

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
          mb-10
        "
      >

        <MainChart
          chartData={chartData}
          botState={botState}
        />

      </motion.div>

      {/* EMA CHART */}

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

        <EMAChart
          chartData={chartData}
        />

      </motion.div>

      {/* RSI + MACD */}

      <div className="
        grid
        grid-cols-1
        2xl:grid-cols-2
        gap-8
        mb-10
      ">

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
            delay: 0.25
          }}
        >

          <RSIChart
            chartData={chartData}
          />

        </motion.div>

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

          <MACDChart
            chartData={chartData}
          />

        </motion.div>

      </div>

      {/* VOLUME */}

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
          delay: 0.35
        }}
      >

        <VolumeChart
          chartData={chartData}
        />

      </motion.div>

    </MainLayout>

  );

};

export default Chart;