import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import API from "../api/axios";

import socket from "../services/socket";

import MainLayout from "../layouts/MainLayout";

import CoinLoader from "../components/loaders/CoinLoader";

import Header from "../components/Header";

import PriceCard from "../components/PriceCard";

import StatCard from "../components/StatCard";

import TradeTable from "../components/TradeTable";

import BotStatus from "../components/BotStatus";

import AnalysisTimer from "../components/AnalysisTimer";

import MarketChart from "../components/MarketChart";

import StrategyBadge from "../components/StrategyBadge";

const Dashboard = () => {

  const [loading, setLoading] =
    useState(true);

  const [botState, setBotState] =
    useState(null);

  const [trades, setTrades] =
    useState([]);

  const [livePrice, setLivePrice] =
    useState(0);

  const [chartData, setChartData] =
    useState([]);

  const tradeList =
    Array.isArray(trades)
      ? trades
      : [];

  const lastBuyTrade =
    tradeList.find(
      (trade) =>
        trade.side === "BUY"
    );

  const lastSellTrade =
    tradeList.find(
      (trade) =>
        trade.side === "SELL"
    );

  const formattedLivePrice =
    Number(livePrice) > 0
      ? new Intl.NumberFormat(
          "en-US",
          {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        ).format(livePrice)
      : null;

  useEffect(() => {

    let cancelled = false;

    const loadDashboardData =
      async () => {

        try {

          const [

            botResponse,

            tradesResponse,

            chartResponse

          ] = await Promise.all([

            API.get("/bot/status"),

            API.get("/trades"),

            API.get("/chart")

          ]);

          if (!cancelled)
          {

            setBotState(
              botResponse.data
            );

            setTrades(
              Array.isArray(
                tradesResponse.data
              )
                ? tradesResponse.data
                : []
            );

            setChartData(
              Array.isArray(
                chartResponse.data
              )
                ? chartResponse.data
                : []
            );

            setLoading(false);

          }

        }
        catch (error)
        {

          console.log(
            "Dashboard Data Error:",
            error
          );

          setLoading(false);

        }

      };

    loadDashboardData();

    const handleLivePrice =
      (data) => {

        setLivePrice(
          data.price
        );

      };

    const handleConnect =
      () => {

        console.log(
          "Socket Connected:",
          socket.id
        );

      };

    const handleError =
      (error) => {

        console.log(
          "Socket Error:",
          error.message
        );

      };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "connect_error",
      handleError
    );

    socket.on(
      "livePrice",
      handleLivePrice
    );

    const interval =
      setInterval(() => {

        loadDashboardData();

      }, 5000);

    return () => {

      cancelled = true;

      clearInterval(interval);

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "connect_error",
        handleError
      );

      socket.off(
        "livePrice",
        handleLivePrice
      );

    };

  }, []);

  useEffect(() => {

    document.title =
      formattedLivePrice
        ? `SOLUSDT • ${formattedLivePrice}`
        : "SOLUSDT • Live Market";

  }, [formattedLivePrice]);

  if (loading)
  {
    return (
      <CoinLoader
        message="LOADING AI TRADING DASHBOARD..."
      />
    );
  }

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

              AI Trading Dashboard

            </h1>

            <p className="
              mt-3
              text-slate-400
              text-lg
              leading-8
              max-w-3xl
            ">

              Real-time institutional-grade
              SOLUSDT analytics dashboard
              powered by AI trading intelligence.

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

            {/* TIMER */}

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

      {/* STATUS */}

      <div className="
        mb-8
      ">

        <BotStatus
          botMode={
            botState?.botMode
          }
        />

      </div>

      {/* STRATEGY */}

      <div className="
        mb-8
      ">

        <StrategyBadge
          strategy={
            botState?.currentStrategy
          }
        />

      </div>

      {/* PRICE CARD */}

      <div className="
        mb-8
      ">

        <PriceCard
          livePrice={livePrice}
        />

      </div>

      {/* MAIN CHART */}

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
          mb-10
        "
      >

        <MarketChart
          chartData={chartData}
          botState={botState}
        />

      </motion.div>

      {/* TOP STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
      ">

        <StatCard
          title="Total Invested"
          value={
            `$${botState?.totalInvestedAmount?.toFixed(2) || 0}`
          }
          color="text-emerald-400"
        />

        <StatCard
          title="Total Loss"
          value={
            `$${botState?.totalLoss?.toFixed(2) || 0}`
          }
          color="text-red-400"
        />

        <StatCard
          title="Last SELL"
          value={
            lastSellTrade
              ? `$${Number(lastSellTrade.price).toFixed(2)}`
              : "$0"
          }
          color="text-cyan-400"
        />

        <StatCard
          title="Last BUY"
          value={
            lastBuyTrade
              ? `$${Number(lastBuyTrade.price).toFixed(2)}`
              : "$0"
          }
          color="text-blue-400"
        />

      </div>

      {/* SECOND STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
      ">

        <StatCard
          title="Balance"
          value={
            `$${botState?.availableBalance?.toFixed(2) || 0}`
          }
          color={
            botState?.balanceWarning
              ? "text-red-400"
              : "text-emerald-400"
          }
          warning={
            botState?.balanceWarning
          }
        />

        <StatCard
          title="SOL Holdings"
          value={
            botState?.solHolding?.toFixed(4) || 0
          }
          color="text-blue-400"
        />

        <StatCard
          title="Profit"
          value={
            `$${botState?.totalProfit?.toFixed(2) || 0}`
          }
          color="text-yellow-400"
        />

        <StatCard
          title="Last Action"
          value={
            botState?.lastAction || "NONE"
          }
          color="text-pink-400"
        />

      </div>

      {/* MINI DASHBOARD */}

      <div className="
        flex
        justify-end
        mb-10
      ">

        <Link
          to="/mini-dashboard"
          className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            border
            border-cyan-400/30
            bg-cyan-400/10
            px-6
            py-4
            text-sm
            font-black
            text-cyan-200
            shadow-2xl
            transition-all
            duration-300
            hover:scale-105
            hover:bg-cyan-400/20
            hover:text-white
          "
        >

          Open Mini Dashboard

          <span>

            →

          </span>

        </Link>

      </div>

      {/* TRADES */}

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
      >

        <TradeTable
          trades={tradeList}
        />

      </motion.div>

    </MainLayout>

  );

};

export default Dashboard;