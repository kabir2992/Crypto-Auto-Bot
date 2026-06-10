import { useState, useEffect } from "react";
import MainChart from "../components/MainChart";
import MiniLineChart from "../components/MiniLineChart";
import { formatRupee, getPnLColor } from "../utils/formatRupee";
import { formatSymbol, formatBase, extractBase } from "../utils/formatSymbol";
import { useLivePrice } from "../hooks/useLivePrice";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, title, children, accent }) {
  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: 20,
      padding: "22px 24px",
      border: `1px solid ${accent ? "rgba(232,97,10,0.18)" : "var(--border)"}`,
      boxShadow: accent ? "var(--shadow)" : "var(--shadow-sm)",
    }}>
      <div style={{
        fontSize: 10, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.12em",
        marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
      }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

// ─── Next Analysis Timer ──────────────────────────────────────────────────────
function AnalysisTimer({ nextAnalysisTime }) {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!nextAnalysisTime) return;
    const tick = () => {
      const target = new Date(nextAnalysisTime);
      if (Number.isNaN(target.getTime())) return;
      const diff = target - new Date();
      setSecs(Math.max(0, Math.floor(diff / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [nextAnalysisTime]);

  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  const pct = Math.min(100, ((300 - secs) / 300) * 100);

  return (
    <StatCard icon="⏱" title="Next Analysis" accent>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 44, fontWeight: 700,
        color: "var(--accent)", letterSpacing: "0.06em",
        textShadow: "0 0 24px rgba(255,122,26,0.3)",
        lineHeight: 1,
      }}>
        {m}:{s}
      </div>
      <div style={{ marginTop: 12, height: 5, borderRadius: 3,
        background: "var(--border)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3, transition: "width 1s linear",
          width: `${pct}%`,
          background: "linear-gradient(90deg,var(--accent),var(--gold))",
        }}/>
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
        Analysis runs every 5 minutes
      </div>
    </StatCard>
  );
}

// ─── Live Prices Table ────────────────────────────────────────────────────────
function LivePricesTable({ prices, flashColors, priceHistory }) {
  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: 20,
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)", overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
          📡 Live Prices
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 7px var(--green)",
            animation: "blink 1.5s infinite",
          }}/>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Real-time</span>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr style={{ background: "var(--bg-2)" }}>
              {["Commodity", "Live Price", "High", "Low", "Trend", "Updated"].map(h => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: 10, color: "var(--text-muted)",
                  textTransform: "uppercase", letterSpacing: "0.09em",
                  fontWeight: 600, whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(prices).slice(0, 250).map(([sym, d]) => {
              const flash = flashColors[sym];
              const hist  = priceHistory[sym] || [];
              return (
                <tr key={sym} style={{
                  borderTop: "1px solid var(--border)",
                  background: flash === "green"
                    ? "var(--green-bg)"
                    : flash === "red"
                      ? "var(--red-bg)"
                      : "transparent",
                  transition: "background 0.35s",
                }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                      {formatSymbol(sym) || sym}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {formatBase(sym) || sym}
                    </div>
                    {/* <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {extractBase(sym) || sym}
                    </div> */}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14, fontWeight: 700,
                      color: flash === "green"
                        ? "var(--green)"
                        : flash === "red"
                          ? "var(--red)"
                          : "var(--text)",
                      transition: "color 0.3s",
                    }}>
                      {formatRupee(d.price)}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: "var(--green)" }}>
                    {formatRupee(d.high)}
                  </td>
                  <td style={{ padding: "10px 16px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: "var(--red)" }}>
                    {formatRupee(d.low)}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <MiniLineChart
                      data={hist}
                      color={flash === "green" ? "var(--green)" : flash === "red" ? "var(--red)" : "var(--accent)"}
                      height={36}
                    />
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 10,
                    color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {d.updatedAt
                      ? new Date(d.updatedAt).toLocaleTimeString("en-IN")
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ symbol, botState, nextAnalysisTime }) {
  const { prices, flashColors } = useLivePrice(true);
  const [priceHistory, setPriceHistory] = useState({});

  const selectedSymbol = symbol || Object.keys(prices || {})[0] || "";

  // Build sparkline history (last 30 prices per symbol)
  useEffect(() => {
    setPriceHistory(prev => {
      const next = { ...prev };
      Object.entries(prices).forEach(([sym, d]) => {
        if (!d.price) return;
        if (!next[sym]) next[sym] = [];
        next[sym] = [...next[sym].slice(-29), d.price];
      });
      return next;
    });
  }, [prices]);

  const modeColors = {
    "LONG BUYING":   "var(--green)",
    "LONG SELLING":  "var(--green)",
    "SHORT SELLING": "var(--red)",
    "SHORT CLOSING": "var(--red)",
    "HOLDING":       "var(--gold)",
    "ANALYZING":     "var(--accent)",
    "WAITING":       "var(--text-muted)",
  };
  const modeColor = modeColors[botState?.botMode] || "var(--text-muted)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Main chart */}
      <MainChart symbol={selectedSymbol} />

      {/* Stats row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 16,
      }}>
        {/* Timer */}
        <AnalysisTimer nextAnalysisTime={nextAnalysisTime}/>

        {/* Bot Mode */}
        <StatCard icon="🤖" title="Bot Mode">
          <div style={{
            display: "inline-block",
            fontSize: 16, fontWeight: 700,
            color: modeColor,
            padding: "8px 16px", borderRadius: 10,
            background: `${modeColor}1A`,
            border: `1px solid ${modeColor}30`,
            marginBottom: 8,
          }}>
            {botState?.botMode || "—"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Market:{" "}
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>
              {botState?.marketType || "—"}
            </span>
          </div>
        </StatCard>

        {/* Strategy */}
        <StatCard icon="🎯" title="Strategy">
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: "var(--text)", lineHeight: 1.5, marginBottom: 8,
          }}>
            {botState?.currentStrategy || "Observing Market"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Last Action:{" "}
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {botState?.lastAction || "—"}
            </span>
          </div>
        </StatCard>

        {/* Balance */}
        <StatCard icon="💰" title="Balance">
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20, fontWeight: 700, color: "var(--gold)",
            marginBottom: 10,
          }}>
            {formatRupee(botState?.availableBalance)}
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.08em" }}>Profit</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)",
                fontFamily: "'JetBrains Mono',monospace" }}>
                {formatRupee(botState?.totalProfit)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.08em" }}>Loss</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)",
                fontFamily: "'JetBrains Mono',monospace" }}>
                {formatRupee(botState?.totalLoss)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.08em" }}>Net</div>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: getPnLColor(botState?.realTotalProfit),
                fontFamily: "'JetBrains Mono',monospace",
              }}>
                {formatRupee(botState?.realTotalProfit)}
              </div>
            </div>
          </div>
        </StatCard>
      </div>

      {/* Live Prices */}
      <LivePricesTable
        prices={prices}
        flashColors={flashColors}
        priceHistory={priceHistory}
      />
    </div>
  );
}