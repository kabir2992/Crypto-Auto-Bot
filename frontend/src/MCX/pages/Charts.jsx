import MainChart from "../components/MainChart";
import { formatSymbol } from "../utils/formatSymbol";

export default function Charts({ symbol }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {symbol ? (
        <>
          <div style={{
            background: "var(--bg-card)", borderRadius: 16,
            padding: "14px 20px",
            border: "1px solid var(--border)",
            fontSize: 12, color: "var(--text-muted)",
          }}>
            Viewing full chart for{" "}
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              {formatSymbol(symbol)}
            </span>
            {" "}— use the dropdown in the topbar to switch commodity.
          </div>
          <MainChart symbol={symbol}/>
        </>
      ) : (
        <div style={{
          height: 400, background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: 12,
        }}>
          <div style={{ fontSize: 48 }}>📈</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Select a Commodity
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Use the dropdown in the topbar to choose a commodity to chart
          </div>
        </div>
      )}
    </div>
  );
}