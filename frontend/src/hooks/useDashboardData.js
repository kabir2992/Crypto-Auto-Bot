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
    async ( showLoader = false ) => {

      try {

        if (showLoader)
        {
            setLoading(true);
        }

        const [
          botResponse,
          tradesResponse,
          chartResponse
        ] = await Promise.all([

          API.get("/bot/status"),

          API.get("/trades"),

          API.get("/chart")

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

        // =========================
        // AI ANALYSIS
        // =========================

        try {

          const latestCandle =
                chart[
                chart.length - 1
                ];

            API.post(
                "/ai/analyze",
                {
                    candles: chart,
                    latestCandle
                }
            )
                .then((aiResponse) => {

                    if (
                        aiResponse.data?.success
                    ) {

                        setAiData(
                            aiResponse.data.ai
                        );

                    }

                })
                .catch((aiError) => {

                    console.log(
                        "AI Error:",
                        aiError
                    );

                });

        }
        catch (aiError)
        {
          console.log(
            "AI Error:",
            aiError
          );
        }

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

        fetchDashboardData(true);

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