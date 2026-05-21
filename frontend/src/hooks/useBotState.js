import { useEffect, useState } from "react";
import API from "../api/axios";

const useBotData = () => {

  const [botState, setBotState] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchBotData = async () => {

    try {

      const response =
        await API.get("/bot/status");

      setBotState(response.data);

    }
    catch (error)
    {
      console.log("Bot Data Error:", error);
    }
    finally
    {
      setLoading(false);
    }

  };

  useEffect(() => {

    fetchBotData();

    const interval =
      setInterval(fetchBotData, 5000);

    return () => clearInterval(interval);

  }, []);

  return {
    botState,
    loading,
    refreshBotData: fetchBotData
  };

};

export default useBotData;