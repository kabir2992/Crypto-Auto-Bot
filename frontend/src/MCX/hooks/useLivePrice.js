import { useState, useEffect, useRef } from "react";
import API from "../api/axios";

export function useLivePrice(enabled = true) {
  const [prices, setPrices]         = useState({});
  const [flashColors, setFlash]     = useState({});
  const prevRef                     = useRef({});

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        const res = await API.get("/mcxmarket/all");
        const data = await res.data;

        // console.log("MCX Market Response:", data);
        // Stronger safety checks
        if (!data || typeof data !== "object") {
          console.warn("MCX Market API returned invalid response");
          return;
        }

        const incoming = (data.success && data.data) ? data.data : {};

        if (typeof incoming !== "object") {
          console.warn("MCX Market data is not an object:", incoming);
          return;
        }

        const newFlash = {};

        Object.entries(incoming).forEach(([sym, d]) => {
          const prev = prevRef.current[sym]?.price;
          if (prev != null && d?.price !== prev) {
            newFlash[sym] = d.price > prev ? "green" : "red";
          }
        });

        prevRef.current = incoming;
        setPrices(incoming);

        if (Object.keys(newFlash).length > 0) {
          setFlash(newFlash);
          setTimeout(() => setFlash({}), 700);
        }
      } catch (err) {
        console.error("Live price poll failed:", err);
        // Do NOT set prices to null
      }
    };

    poll();
    const t = setInterval(poll, 1000);
    return () => clearInterval(t);
  }, [enabled]);

  return { prices, flashColors };
}