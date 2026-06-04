import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";
import { getAllCommodities } from "../api/market.api";
import api from "../api/axios";

export default function Dashboard() {
  const [commodities, setCommodities] = useState([]);
  const [selected, setSelected] = useState("");
  const [botState, setBotState] = useState(null);

  // 🔥 FETCH ALL LIVE COMMODITIES
  const fetchCommodities = async () => {
    try {
      const res = await getAllCommodities();

      setCommodities(res.data.data);

      if (!selected && res.data.data.length > 0) {
        setSelected(res.data.data[0].symbol);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // 🔥 BOT STATE
  const fetchBotState = async () => {
    try {
      const res = await api.get(`/bot/state/${selected}`);
      setBotState(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchCommodities();

    const interval = setInterval(fetchCommodities, 2000); // LIVE refresh

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selected) return;

    fetchBotState();

    const interval = setInterval(fetchBotState, 5000);

    return () => clearInterval(interval);
  }, [selected]);

  const selectedCommodity = commodities.find(
    (c) => c.symbol === selected
  );

  return (
    <div className="bg-black min-h-screen text-white">

      <Sidebar />

      <Topbar
        selected={selected}
        setSelected={setSelected}
        commodities={commodities}
        livePrice={selectedCommodity}
      />

      <div className="ml-64 pt-20 p-6 space-y-6">

        {/* BOT GRID */}
        <div className="grid grid-cols-4 gap-4">

          <div className="bg-orange-900/20 p-4 rounded-xl">
            Bot Mode: {botState?.botMode}
          </div>

          <div className="bg-orange-900/20 p-4 rounded-xl">
            Strategy: {botState?.currentStrategy}
          </div>

          <div className="bg-orange-900/20 p-4 rounded-xl">
            Next Analysis:
            <br />
            {botState?.nextAnalysisTime
              ? new Date(botState.nextAnalysisTime).toLocaleTimeString()
              : "Loading"}
          </div>

          <div className="bg-orange-900/20 p-4 rounded-xl">
            Balance: ₹ {botState?.availableBalance}
          </div>

        </div>

        {/* LIVE PRICE FEED */}
        <div className="grid grid-cols-4 gap-4">
          {commodities.map((c) => (
            <div
              key={c.symbol}
              className="p-4 rounded-xl border border-orange-500/20"
            >
              <div className="font-bold">{c.symbol}</div>
              <div
                className={
                  c.change > 0
                    ? "text-green-400"
                    : c.change < 0
                    ? "text-red-400"
                    : "text-white"
                }
              >
                ₹ {c.price}
              </div>
              <div className="text-xs text-gray-400">
                {c.change.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}