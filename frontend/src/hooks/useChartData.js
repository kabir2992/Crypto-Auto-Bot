import { useEffect, useState } from "react";
import API from "../api/axios";

const useChartData = () => {

  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {

    try {

      const response =
        await API.get("/chart");

      setChartData(response.data);

    }
    catch (error)
    {
      console.log("Chart Error:", error);
    }
    finally
    {
      setLoading(false);
    }

  };

  useEffect(() => {

    fetchChartData();

    const interval =
      setInterval(fetchChartData, 5000);

    return () => clearInterval(interval);

  }, []);

  return {
    chartData,
    loading
  };

};

export default useChartData;