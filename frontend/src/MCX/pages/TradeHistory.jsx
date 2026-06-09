import { useState, useEffect } from "react";
import { formatRupee, getPnLColor } from "../utils/formatRupee";
import LoadingScreen from "../components/LoadingScreen";
import API from "../api/axios";

const SIDE_COLORS = {
  LONG_BUY:    { bg: "var(--green-bg)", color: "var(--green)"      },
  LONG_SELL:   { bg: "var(--red-bg)",   color: "var(--red)"        },
  SHORT_SELL:  { bg: "var(--red-bg)",   color: "var(--red)"        },
  SHORT_CLOSE: { bg: "var(--green-bg)", color: "var(--green)"      },
};

export default function TradeHistory() {
  const [tab,     setTab]     = useState("history");
  const [trades,  setTrades]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const ep = tab === "open"
      ? "/mcxtrade/positions"
      : "/mcxtrade/history";
    API.get(ep)
      .then(r => r.data)
      .then(d => { if (d.success) setTrades(d.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "history", label: "📋 All Trades"       },
          { id: "open",    label: "🟢 Open Positions"   },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 22px", borderRadius: 10,
            border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            background: tab === t.id
              ? "linear-gradient(135deg,var(--accent),var(--gold))"
              : "var(--bg-card)",
            color: tab === t.id ? "#fff" : "var(--text-muted)",
            boxShadow: tab === t.id ? "0 3px 12px rgba(232,97,10,0.35)" : "none",
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ height: 300, position: "relative" }}>
          <div style={{ transform: "scale(0.55)", transformOrigin: "top center" }}>
            <LoadingScreen message="Loading trades..."/>
          </div>
        </div>
      ) : (
        <div style={{
          background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)", overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 660 }}>
              <thead>
                <tr style={{ background: "var(--bg-2)" }}>
                  {["Symbol","Side","Lots","Entry","Exit","P&L","Strategy","Status","Date"].map(h => (
                    <th key={h} style={{
                      padding: "12px 14px", textAlign: "left",
                      fontSize: 10, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.09em",
                      fontWeight: 600, whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{
                      padding: "48px", textAlign: "center",
                      color: "var(--text-muted)", fontSize: 14,
                    }}>
                      No trades found
                    </td>
                  </tr>
                ) : trades.map(t => {
                  const sc = SIDE_COLORS[t.side] || {};
                  return (
                    <tr key={t._id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                          {t.symbol}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6,
                          fontSize: 10, fontWeight: 700,
                          background: sc.bg, color: sc.color,
                        }}>{t.side}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13,
                        fontFamily: "monospace", color: "var(--text)" }}>
                        {t.lots}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12,
                        fontFamily: "'JetBrains Mono',monospace", color: "var(--text)" }}>
                        {formatRupee(t.entryPrice)}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12,
                        fontFamily: "'JetBrains Mono',monospace", color: "var(--text-muted)" }}>
                        {t.exitPrice ? formatRupee(t.exitPrice) : "—"}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700,
                        fontFamily: "'JetBrains Mono',monospace",
                        color: getPnLColor(t.profit) }}>
                        {t.profit != null ? formatRupee(t.profit) : "—"}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 11,
                        color: "var(--text-muted)", maxWidth: 160,
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap" }}>
                        {t.strategy || "—"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 10,
                          background: t.status === "OPEN"
                            ? "var(--green-bg)" : "var(--bg-2)",
                          color: t.status === "OPEN"
                            ? "var(--green)" : "var(--text-muted)",
                        }}>{t.status}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 10,
                        color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(t.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}