import { useState, useEffect } from "react";

const ITEMS = [
  { emoji: "🥇", label: "Gold" },
  { emoji: "🥈", label: "Silver" },
  { emoji: "🛢️", label: "Crude Oil" },
  { emoji: "⚡", label: "Natural Gas" },
  { emoji: "🔩", label: "Copper" },
  { emoji: "🧲", label: "Nickel" },
  { emoji: "🪙", label: "Zinc" },
  { emoji: "💎", label: "Lead" },
];

export default function LoadingScreen({ message = "Loading..." }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive(p => (p + 1) % ITEMS.length),
      650
    );
    return () => clearInterval(t);
  }, []);

  const R_OUTER = 88;
  const R_INNER = 56;
  const CX = 110;
  const CY = 110;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 28,
    }}>
      {/* Orbiting ring */}
      <div style={{ position: "relative", width: 220, height: 220 }}>
        <svg
          width="220" height="220"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Outer ring static */}
          <circle cx={CX} cy={CY} r={R_OUTER}
            fill="none" stroke="var(--border)" strokeWidth="1.5"/>
          {/* Outer ring animated arc */}
          <circle cx={CX} cy={CY} r={R_OUTER}
            fill="none" stroke="var(--accent)" strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * R_OUTER * 0.3} ${2 * Math.PI * R_OUTER * 0.7}`}
            strokeLinecap="round"
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              animation: "spin 2s linear infinite",
            }}
          />
          {/* Inner ring */}
          <circle cx={CX} cy={CY} r={R_INNER}
            fill="none" stroke="var(--border)" strokeWidth="1"
            strokeDasharray="4 6"/>
          {/* Gold ring */}
          <circle cx={CX} cy={CY} r={R_INNER}
            fill="none" stroke="var(--gold)" strokeWidth="1.5"
            strokeDasharray={`${2 * Math.PI * R_INNER * 0.2} ${2 * Math.PI * R_INNER * 0.8}`}
            strokeLinecap="round"
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              animation: "spinReverse 3s linear infinite",
            }}
          />
        </svg>

        {/* Orbiting items */}
        {ITEMS.map((item, i) => {
          const angle = (i / ITEMS.length) * 2 * Math.PI - Math.PI / 2;
          const x = CX + R_OUTER * Math.cos(angle) - 14;
          const y = CY + R_OUTER * Math.sin(angle) - 14;
          const isActive = active === i;
          return (
            <div
              key={i}
              title={item.label}
              style={{
                position: "absolute",
                left: x, top: y,
                width: 28, height: 28,
                fontSize: 18,
                lineHeight: "28px",
                textAlign: "center",
                transition: "all 0.5s cubic-bezier(.34,1.56,.64,1)",
                transform: isActive ? "scale(2)" : "scale(0.8)",
                opacity: isActive ? 1 : 0.35,
                filter: isActive
                  ? "drop-shadow(0 0 10px var(--accent))"
                  : "none",
                zIndex: isActive ? 2 : 1,
              }}
            >
              {item.emoji}
            </div>
          );
        })}

        {/* Centre active emoji */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: 36,
          animation: "pulse 1.2s ease-in-out infinite",
          filter: "drop-shadow(0 0 12px var(--accent))",
        }}>
          {ITEMS[active].emoji}
        </div>
      </div>

      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26, fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: "0.04em",
        }}>
          MCX AI Bot
        </div>
        <div style={{
          fontSize: 11, color: "var(--text-muted)",
          marginTop: 6, letterSpacing: "0.15em",
          textTransform: "uppercase",
          animation: "fadeInOut 1.3s ease-in-out infinite",
        }}>
          {message}
        </div>
        <div style={{
          marginTop: 12, fontSize: 13,
          color: "var(--gold)",
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: "0.06em",
        }}>
          {ITEMS[active].label}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.25); }
        }
        @keyframes fadeInOut {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}