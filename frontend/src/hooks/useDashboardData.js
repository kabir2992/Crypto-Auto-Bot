import {
  useEffect,
  useState
} from "react";

import API from "../api/axios";

const useDashboardData = () => {

  const [botState, setBotState] =
    useState(null);

  const [trades, setTrades] =
    useState([]);

  const [chartData, setChartData] =
    useState([]);

  const [aiData, setAiData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const fetchDashboardData =
    async ( showLoader = true ) => {

      try {

        if (showLoader)
        {
            setLoading(true);
        }

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

        setBotState(
          botResponse.data
        );

        setTrades(
          Array.isArray(tradesResponse.data)
            ? tradesResponse.data
            : []
        );

        const chart =
          Array.isArray(chartResponse.data)
            ? chartResponse.data
            : [];

        setChartData(chart);

        setAiData( aiResponse.data?.ai || null );

        // =========================
        // AI ANALYSIS
        // =========================

      }
      catch (err)
      {

        console.log(
          "Dashboard Error:",
          err
        );

        setError(err);

      }
      finally
      {
        if (showLoader)
        {
            setLoading(false);
        }

      }

    };

  useEffect(() => {

    fetchDashboardData();

    const interval =
      setInterval(() => {

        fetchDashboardData(false);

      }, 15000);

    return () =>
      clearInterval(interval);

  }, []);

  return {

    botState,

    trades,

    chartData,

    aiData,

    loading,

    error,

    refreshDashboard:
      fetchDashboardData

  };

};

export default useDashboardData;