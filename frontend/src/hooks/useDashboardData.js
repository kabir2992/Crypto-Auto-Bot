import { useEffect, useState } from "react";

import API from "../api/axios";

import socket from "../services/socket";

const useDashboardData = () => {

  const [botState, setBotState] =
    useState(null);

  const [trades, setTrades] =
    useState([]);

  const [chartData, setChartData] =
    useState([]);

  const [livePrice, setLivePrice] =
    useState(0);

  const [aiData, setAiData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD ALL DATA
  // =========================

  const loadAllData = async () => {

    try {

      const [
        botResponse,
        tradesResponse,
        chartResponse,
        aiResponse
      ] = await Promise.all([

        API.get("/bot/status"),

        API.get("/trades"),

        API.get("/chart"),

        API.get("/ai/analyze")

      ]);

      setBotState(botResponse.data);

      setTrades(tradesResponse.data || []);

      setChartData(chartResponse.data || []);

      setAiData(aiResponse.data?.ai || null);

    }
    catch (error)
    {
      console.log(
        "Dashboard Hook Error:",
        error
      );
    }
    finally
    {
      setLoading(false);
    }

  };

  // =========================
  // SOCKET
  // =========================

  useEffect(() => {

    loadAllData();

    const interval =
      setInterval(loadAllData, 5000);

    socket.on(
      "livePrice",
      (data) => {

        setLivePrice(data.price);

      }
    );

    return () => {

      clearInterval(interval);

      socket.off("livePrice");

    };

  }, []);

  return { botState, trades, chartData, livePrice, aiData, loading };

};

export default useDashboardData;