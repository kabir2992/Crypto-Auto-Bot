import { useState, useEffect, useRef } from "react";
import API from "../api/axios";

/**
 * Polls /mcx/api/mcxbot/state every 5 seconds
 */
export function useBotState(enabled = true) {
  const [botStates, setBotStates] = useState([]);
  const statesRef = useRef([]);
  const [nextAnalysisTime, setNextAnalysisTime] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        const res = await API.get("/mcxbot/state");

        const data = res.data;

        console.log("BotState API Response nextAnalysisTime:", data?.nextAnalysisTime, "raw:", data);

        if (data.success && data.states) {
          setBotStates(data.states);
          statesRef.current = data.states;
          if (data.nextAnalysisTime) setNextAnalysisTime(data.nextAnalysisTime);
        } else {
          console.warn("BotState API did not return valid states:", data);
        }
      } catch (err) {
        console.error("useBotState fetch error:", err.message);
      }
    };

    poll();
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, [enabled]);

  const getBotState = (symbol) => {
    if (!symbol) return null;
    return statesRef.current.find(s => s.commodity === symbol) || null;
  }
    

  return { botStates, getBotState, nextAnalysisTime };
}