export default function Analytics() {
  const cards = [
    { icon: "📊", title: "Market Condition",   desc: "Real-time market type detection — BULLISH / BEARISH / SIDEWAYS / VOLATILE" },
    { icon: "🎯", title: "Strategy Votes",      desc: "Per-indicator voting system showing why a strategy was selected" },
    { icon: "🔮", title: "Prediction Engine",   desc: "AI-powered next-candle direction prediction (coming soon)" },
    { icon: "📉", title: "Risk Analysis",       desc: "ATR-based SL/TP analysis and position risk scoring" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Coming Soon Banner */}
      <div style={{
        background: "linear-gradient(135deg,rgba(232,97,10,0.1),rgba(212,160,23,0.08))",
        borderRadius: 20, padding: "28px 32px",
        border: "1px solid rgba(232,97,10,0.2)",
        display: "flex", alignItems: "center", gap: 20,
        flexWrap: "wrap",
      }}>
        <div style={{ fontSize: 56 }}>🤖</div>
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, fontWeight: 700, color: "var(--text)",
            marginBottom: 6,
          }}>AI Analytics</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 480 }}>
            Deep market intelligence powered by your bot's indicators and strategy engine.
            Full analytics dashboard is under development.
          </div>
        </div>
        <div style={{
          marginLeft: "auto",
          padding: "8px 18px", borderRadius: 10,
          background: "rgba(232,97,10,0.12)",
          border: "1px solid rgba(232,97,10,0.25)",
          fontSize: 12, fontWeight: 700, color: "var(--accent)",
        }}>
          Coming Soon
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
      }}>
        {cards.map(c => (
          <div key={c.title} style={{
            background: "var(--bg-card)", borderRadius: 18,
            padding: "24px", border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            opacity: 0.75,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "var(--text)",
              marginBottom: 8,
            }}>{c.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
              {c.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}