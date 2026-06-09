import { useState, useEffect } from "react";
import { formatRupee, formatRupeeCompact, getPnLColor } from "../utils/formatRupee";
import LoadingScreen from "../components/LoadingScreen";
import API from "../api/axios";

function StatTile({ label, value, color, sub }) {
  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: 18,
      padding: "22px 24px",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{
        fontSize: 10, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 22, fontWeight: 700,
        color: color || "var(--text)",
      }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{sub}</div>
      )}
    </div>
  );
}

export default function Wallet() {
  const [states,  setStates]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/mcxbot/state")
      .then(r => r.data)
      .then(d => { if (d.success) setStates(d.states || []); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ height: 300, position: "relative" }}>
      <div style={{ transform: "scale(0.55)", transformOrigin: "top center" }}>
        <LoadingScreen message="Loading wallet..."/>
      </div>
    </div>
  );

  const totalBalance  = states.reduce((a, s) => a + (s.availableBalance || 0), 0);
  const totalProfit   = states.reduce((a, s) => a + (s.totalProfit || 0), 0);
  const totalLoss     = states.reduce((a, s) => a + (s.totalLoss || 0), 0);
  const totalNet      = totalProfit - totalLoss;
  const totalInvested = states.reduce((a, s) => a + (s.totalInvestedAmount || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary tiles */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: 16,
      }}>
        <StatTile
          label="Available Balance"
          value={formatRupeeCompact(totalBalance)}
          color="var(--gold)"
          sub="Across all commodities"
        />
        <StatTile
          label="Total Profit"
          value={formatRupeeCompact(totalProfit)}
          color="var(--green)"
        />
        <StatTile
          label="Total Loss"
          value={formatRupeeCompact(totalLoss)}
          color="var(--red)"
        />
        <StatTile
          label="Net P&L"
          value={formatRupeeCompact(totalNet)}
          color={getPnLColor(totalNet)}
          sub={totalNet >= 0 ? "In profit 🎉" : "In loss"}
        />
        <StatTile
          label="Total Invested"
          value={formatRupeeCompact(totalInvested)}
          color="var(--accent)"
          sub="Margin deployed"
        />
      </div>

      {/* Per-commodity breakdown */}
      <div style={{
        background: "var(--bg-card)", borderRadius: 20,
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)", overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          fontWeight: 700, fontSize: 14, color: "var(--text)",
        }}>
          📊 Per-Commodity Breakdown
        </div>

        {states.length === 0 ? (
          <div style={{
            padding: "48px", textAlign: "center",
            color: "var(--text-muted)", fontSize: 14,
          }}>
            No bot states found. Select commodities in Settings to get started.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
              <thead>
                <tr style={{ background: "var(--bg-2)" }}>
                  {["Commodity","Balance","Profit","Loss","Net P&L","Mode","Last Action"].map(h => (
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
                {states.map(s => {
                  const net = (s.totalProfit || 0) - (s.totalLoss || 0);
                  return (
                    <tr key={s._id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                          {s.commodity}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 12, color: "var(--gold)", fontWeight: 700 }}>
                        {formatRupee(s.availableBalance)}
                      </td>
                      <td style={{ padding: "12px 16px",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 12, color: "var(--green)" }}>
                        {formatRupee(s.totalProfit)}
                      </td>
                      <td style={{ padding: "12px 16px",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 12, color: "var(--red)" }}>
                        {formatRupee(s.totalLoss)}
                      </td>
                      <td style={{ padding: "12px 16px",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 13, fontWeight: 700,
                        color: getPnLColor(net) }}>
                        {formatRupee(net)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6,
                          fontSize: 10, fontWeight: 600,
                          background: "var(--bg-2)",
                          color: "var(--text-muted)",
                        }}>
                          {s.botMode || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 11,
                        color: "var(--accent)", fontWeight: 600 }}>
                        {s.lastAction || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}