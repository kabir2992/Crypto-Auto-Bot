import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatSymbol, formatBase, extractBase } from "../utils/formatSymbol";
import { formatRupee } from "../utils/formatRupee";

export default function Topbar({
  user, selectedSymbol, onSymbolChange,
  livePrice, flashColor, symbols, sidebarWidth,
}) {
  const { theme, toggle } = useTheme();
  const [open, setOpen]   = useState(false);
  const [expanded, setExpanded] = useState(null);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Group symbols by base key
  const grouped = {};
  (symbols || []).forEach(sym => {
    const base = extractBase(sym);
    if (!grouped[base]) grouped[base] = [];
    grouped[base].push(sym);
  });

  const priceUp   = flashColor === "green";
  const priceDown = flashColor === "red";

  return (
    <header style={{
      position: "fixed", top: 0, right: 0, zIndex: 99,
      left: sidebarWidth,
      height: 64,
      background: "var(--bg-topbar)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 20px", gap: 12,
      boxShadow: "var(--shadow-sm)",
      transition: "left 0.3s cubic-bezier(.4,0,.2,1)",
    }}>

      {/* Commodity Selector */}
      <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px",
            background: "var(--bg-input)",
            border: "1.5px solid var(--border)",
            borderRadius: 10, cursor: "pointer",
            color: "var(--text)", fontSize: 13, fontWeight: 600,
            transition: "border-color 0.2s",
            maxWidth: 220, whiteSpace: "nowrap",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <span>📦</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedSymbol
              ? formatBase(selectedSymbol)
              : "Select Commodity"}
          </span>
          <span style={{ opacity: 0.5, marginLeft: 4, fontSize: 10 }}>
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            boxShadow: "var(--shadow)",
            width: 280, maxHeight: 380,
            overflowY: "auto", zIndex: 200, padding: 8,
          }}>
            {Object.entries(grouped).map(([base, fulls]) => (
              <div key={base}>
                {/* Base row */}
                <button
                  onClick={() => setExpanded(expanded === base ? null : base)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px", background: "none",
                    border: "none", borderRadius: 8,
                    cursor: "pointer",
                    color: "var(--text)", fontSize: 13, fontWeight: 700,
                    textAlign: "left",
                  }}
                >
                  <span>{formatBase(base + "FUT")}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {fulls.length} {expanded === base ? "▲" : "▼"}
                  </span>
                </button>

                {/* Full symbol options */}
                {expanded === base && fulls.map(sym => (
                  <button
                    key={sym}
                    onClick={() => {
                      onSymbolChange(sym);
                      setOpen(false);
                      setExpanded(null);
                    }}
                    style={{
                      width: "100%", textAlign: "left",
                      padding: "8px 12px 8px 26px",
                      background: selectedSymbol === sym
                        ? "rgba(232,97,10,0.10)" : "none",
                      border: "none", borderRadius: 8,
                      cursor: "pointer", fontSize: 12,
                      color: selectedSymbol === sym
                        ? "var(--accent)" : "var(--text-muted)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => {
                      if (selectedSymbol !== sym)
                        e.currentTarget.style.background = "var(--bg-2)";
                    }}
                    onMouseLeave={e => {
                      if (selectedSymbol !== sym)
                        e.currentTarget.style.background = "none";
                    }}
                  >
                    {formatSymbol(sym)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Price Badge */}
      {livePrice && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 14px", borderRadius: 10,
          background: priceUp
            ? "var(--green-bg)"
            : priceDown
              ? "var(--red-bg)"
              : "var(--bg-input)",
          border: `1.5px solid ${priceUp
            ? "rgba(76,175,80,0.3)"
            : priceDown
              ? "rgba(239,83,80,0.3)"
              : "var(--border)"}`,
          transition: "all 0.35s",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15, fontWeight: 700,
            color: priceUp
              ? "var(--green)"
              : priceDown
                ? "var(--red)"
                : "var(--text)",
            transition: "color 0.35s",
          }}>
            {formatRupee(livePrice.price)}
          </span>
          <span style={{
            fontSize: 10,
            color: priceUp ? "var(--green)" : priceDown ? "var(--red)" : "var(--text-muted)",
          }}>
            {priceUp ? "▲" : priceDown ? "▼" : "●"}
          </span>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Theme Toggle */}
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        style={{
          width: 48, height: 26, borderRadius: 13, border: "none",
          cursor: "pointer", position: "relative", flexShrink: 0,
          background: theme === "dark"
            ? "linear-gradient(135deg,#1a1008,var(--accent))"
            : "linear-gradient(135deg,var(--gold),var(--accent))",
          boxShadow: "0 2px 8px rgba(232,97,10,0.3)",
          transition: "background 0.3s",
        }}
      >
        <div style={{
          position: "absolute", top: 3,
          left: theme === "dark" ? "calc(100% - 23px)" : "3px",
          width: 20, height: 20, borderRadius: "50%",
          background: "#fff",
          transition: "left 0.3s cubic-bezier(.34,1.56,.64,1)",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 11,
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}>
          {theme === "dark" ? "🌙" : "☀️"}
        </div>
      </button>

      {/* Welcome + Avatar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 12px", borderRadius: 10,
        background: "var(--bg-input)",
        border: "1px solid var(--border)",
        flexShrink: 0, cursor: "pointer",
        transition: "border-color 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <span style={{
          fontSize: 12, color: "var(--text-muted)",
          display: window.innerWidth < 540 ? "none" : "block",
          whiteSpace: "nowrap",
        }}>
          Welcome,{" "}
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>
            {user?.firstName || "Trader"}
          </span>
        </span>

        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,var(--accent),var(--gold))",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff",
          boxShadow: "0 2px 8px rgba(232,97,10,0.45)",
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          {(user?.firstName || "T")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}