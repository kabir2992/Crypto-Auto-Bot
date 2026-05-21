import { useEffect, useState } from "react";
import API from "../api/axios";

const useTrades = () => {

  const [trades, setTrades] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => {

    try {

      const response =
        await API.get("/trades");

      setTrades(response.data);

    }
    catch (error)
    {
      console.log("Trades Error:", error);
    }
    finally
    {
      setLoading(false);
    }

  };

  useEffect(() => {

    fetchTrades();

    const interval =
      setInterval(fetchTrades, 5000);

    return () => clearInterval(interval);

  }, []);

  return {
    trades,
    loading
  };

};

export default useTrades;