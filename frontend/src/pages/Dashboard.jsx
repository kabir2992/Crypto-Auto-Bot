import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../api/axios";

import socket from "../services/socket";

import Header from "../components/Header";

import PriceCard from "../components/PriceCard";

import StatCard from "../components/StatCard";

import TradeTable from "../components/TradeTable";

import BotStatus from "../components/BotStatus";

import AnalysisTimer from "../components/AnalysisTimer";

import MarketChart from "../components/MarketChart";

import StrategyBadge from "../components/StrategyBadge";

const Dashboard = () => {

  const [botState, setBotState] =
    useState(null);

  const [trades, setTrades] =
    useState([]);

  const [livePrice, setLivePrice] =
    useState(0);

  const [chartData, setChartData] =
    useState([]);

  const tradeList =
    Array.isArray(trades) ? trades : [];

  const lastBuyTrade = tradeList.find((trade) => trade.side === "BUY");

  const lastSellTrade = tradeList.find((trade) => trade.side === "SELL");

  const formattedLivePrice =
    Number(livePrice) > 0
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(livePrice)
      : null;

  useEffect(() => {
  let cancelled = false;

  const loadDashboardData = async () => {
    try {
      const [botResponse, tradesResponse] =
        await Promise.all([
          API.get("/bot/status"),
          API.get("/trades")
        ]);

      if (!cancelled) {
        setBotState(botResponse.data);
        setTrades(Array.isArray(tradesResponse.data) ? tradesResponse.data : []);
      }

    } catch (error) {
      console.log("Dashboard Data Error: ", error);
    }
  };

  loadDashboardData();

  const handleLivePrice = (data) => {
    console.log("Live Price Received:", data);
    setLivePrice(data.price);
  };

  const handleConnect = () => {
    console.log("Socket Connected:", socket.id);
  };

  const handleError = (error) => {
    console.log("Socket Error:", error.message);
  };

  socket.on("connect", handleConnect);
  socket.on("connect_error", handleError);
  socket.on("livePrice", handleLivePrice);

  const interval = setInterval(() => {
    loadDashboardData();
  }, 5000);

  return () => {
    cancelled = true;
    clearInterval(interval);
    socket.off("connect", handleConnect);
    socket.off("connect_error", handleError);
    socket.off("livePrice", handleLivePrice);
  };
}, []);

  useEffect(() => {
    document.title = formattedLivePrice
      ? `SOLUSDT • ${formattedLivePrice}`
      : "SOLUSDT • Live Market";
  }, [formattedLivePrice]);


  useEffect(() => {
    let cancelled = false;

    const loadChartData = async () => {
      try {
        const response = await API.get("/chart");

        if (!cancelled) {
          setChartData(Array.isArray(response.data) ? response.data : []);
        }
      }
      catch (err)
      {
        console.log("Chart Error: ",err);
      }
    };

    loadChartData();

    const chartInterval = setInterval(() => {
      loadChartData();
    }, 5000);
  
    return () => {
        cancelled = true;
        clearInterval(chartInterval);
    };
  }, []);


  return (

    <MainLayout>

      <Header />

      <BotStatus
        botMode={botState?.botMode}
      />

      <AnalysisTimer
        nextAnalysisTime={
          botState?.nextAnalysisTime
        }
        lastAction={
          botState?.lastAction
        }
      />

      <StrategyBadge strategy={ botState?.currentStrategy } />

      <PriceCard livePrice={ livePrice } />

      <MarketChart
        chartData={ chartData }
        botState={ botState }
      />

        

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">

        <StatCard
          title="Total Invested Amount"
          value={ `$${botState?.totalInvestedAmount?.toFixed(2) || 0}` }
          color="text-green-400"
        />

        <StatCard
          title="Total Loss"
          value={ `$${botState?.totalLoss?.toFixed(2) || 0}` }
          color="text-red-400"
        />

        <StatCard
          title="Last Sell Price"
          value={ lastSellTrade ? `$${Number(lastSellTrade.price).toFixed(2)}` : "$0" }
          color="text-green-400"
        />

        <StatCard
          title="Last Buy Price"
          value={ lastBuyTrade ? `$${Number(lastBuyTrade.price).toFixed(2)}` : "$0" }
          color="text-blue-400"
        />

      </div>

        <hr></hr><br></br>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">

        <StatCard
          title="Total Balance"
          value={ `$${botState?.availableBalance?.toFixed(2) || 0}` }
          color={ botState?.balanceWarning ? "text-red-400" : "text-green-400" }
          warning={ botState?.balanceWarning }
        />

        <StatCard
          title="SOL Holdings"
          value={ botState?.solHolding?.toFixed(4) || 0 }
          color="text-blue-400"
        />

        <StatCard
          title="Total Profit"
          value={ `$${botState?.totalProfit?.toFixed(2) || 0}` }
          color="text-yellow-400"
        />

        <StatCard
          title="Last Action"
          value={ botState?.lastAction || "NONE" }
          color="text-red-400"
        />

      </div>
      <div className="flex justify-end mb-8">
        <Link to="/mini-dashboard" className=" inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 shadow-lg shadow-cyan-500/10 transition duration-200 hover:border-cyan-300/60 hover:bg-cyan-400/20 hover:text-white " >
          Mini Dashboard
          <span className="text-cyan-300">-&gt;</span>
        </Link>
      </div>

      <TradeTable trades={ tradeList } />

    </MainLayout>

  );

};

export default Dashboard;
