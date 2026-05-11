import { useEffect, useState } from "react";

import API from "../api/axios";

import socket from "../services/socket";

import Header from "../components/Header";

import PriceCard from "../components/PriceCard";

import StatCard from "../components/StatCard";

import TradeTable from "../components/TradeTable";

import BotStatus from "../components/BotStatus";

import AnalysisTimer from "../components/AnalysisTimer";

const Dashboard = () => {

  const [botState, setBotState] =
    useState(null);

  const [trades, setTrades] =
    useState([]);

  const [livePrice, setLivePrice] =
    useState(0);

  const fetchBotState = async () => {

    try {

      const response =
        await API.get("/bot/status");

      setBotState(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchTrades = async () => {

    try {

      const response =
        await API.get("/trades");

      setTrades(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchBotState();

    fetchTrades();

    socket.on(
      "livePrice",
      (data) => {

        setLivePrice(data.price);

      }
    );

    const interval =
      setInterval(() => {

        fetchBotState();

        fetchTrades();

      }, 5000);

    return () => {

      clearInterval(interval);

      socket.off("livePrice");

    };

  }, []);

  return (

    <div className="
      min-h-screen
      p-6
      bg-[#050816]
      text-white
    ">

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

      <PriceCard
        livePrice={livePrice}
      />

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mb-8
      ">

        <StatCard
          title="Balance"
          value={`$${botState?.availableBalance?.toFixed(2) || 0}`}
          color="text-green-400"
        />

        <StatCard
          title="SOL Holdings"
          value={botState?.solHolding?.toFixed(4) || 0}
          color="text-blue-400"
        />

        <StatCard
          title="Profit"
          value={`$${botState?.totalProfit?.toFixed(2) || 0}`}
          color="text-yellow-400"
        />

        <StatCard
          title="Last Action"
          value={botState?.lastAction || "NONE"}
          color="text-red-400"
        />

      </div>

      <TradeTable trades={trades} />

    </div>

  );

};

export default Dashboard;