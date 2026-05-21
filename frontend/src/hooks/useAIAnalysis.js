import { useEffect, useState } from "react";
import API from "../api/axios";

const useAIAnalysis = () => {

  const [aiData, setAIData] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchAIAnalysis = async () => {

    try {

      const response =
        await API.get("/ai/analyze");

      setAIData(response.data.ai);

    }
    catch (error)
    {
      console.log("AI Analysis Error:", error);
    }
    finally
    {
      setLoading(false);
    }

  };

  useEffect(() => {

    fetchAIAnalysis();

    const interval =
      setInterval(fetchAIAnalysis, 5000);

    return () => clearInterval(interval);

  }, []);

  return {
    aiData,
    loading
  };

};

export default useAIAnalysis;