import { useState } from "react";

export const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard"     },
  { id: "charts",    icon: "📈", label: "Charts"        },
  { id: "analytics", icon: "🤖", label: "AI Analytics"  },
  { id: "history",   icon: "📋", label: "Trade History" },
  { id: "wallet",    icon: "💰", label: "Wallet"        },
  { id: "settings",  icon: "⚙️",  label: "Settings"     },
];

export default function Sidebar({ active, onNav, onLogout, collapsed, onToggle }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0,
      width: collapsed ? 64 : 240,
      background: "var(--bg-sidebar)",
      display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
      zIndex: 100,
      boxShadow: "4px 0 32px rgba(0,0,0,0.4)",
      overflow: "hidden",
    }}>
      {/* Logo row */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: 10, padding: collapsed ? "18px 14px" : "18px 18px",
        borderBottom: "1px solid rgba(240,217,181,0.08)",
        minHeight: 68,
      }}>
        <div style={{
          width: 36, height: 36, minWidth: 36,
          borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,var(--accent),var(--gold))",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18,
          boxShadow: "0 4px 14px rgba(232,97,10,0.5)",
        }}>📊</div>

        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 16, fontWeight: 700,
              color: "var(--text-sidebar)",
              whiteSpace: "nowrap", lineHeight: 1.2,
            }}>MCX AI Bot</div>
            <div style={{
              fontSize: 9, color: "rgba(240,217,181,0.4)",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>Commodity Intelligence</div>
          </div>
        )}

        {/* Collapse toggle */}
        <button onClick={onToggle} style={{
          marginLeft: "auto", background: "none", border: "none",
          color: "rgba(240,217,181,0.3)", cursor: "pointer",
          fontSize: 14, flexShrink: 0, padding: 4,
          transition: "color 0.2s",
        }}
          onMouseEnter={e => e.target.style.color = "var(--accent)"}
          onMouseLeave={e => e.target.style.color = "rgba(240,217,181,0.3)"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: "10px 8px",
        overflowY: "auto", overflowX: "hidden",
      }}>
        {NAV_ITEMS.map(n => {
          const isActive = active === n.id;
          const isHovered = hoveredId === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNav(n.id)}
              title={collapsed ? n.label : undefined}
              onMouseEnter={() => setHoveredId(n.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                width: "100%",
                display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "13px 0" : "12px 14px",
                background: isActive
                  ? "linear-gradient(135deg,rgba(232,97,10,0.22),rgba(212,160,23,0.12))"
                  : isHovered
                    ? "rgba(240,217,181,0.05)"
                    : "transparent",
                border: isActive
                  ? "1px solid rgba(232,97,10,0.28)"
                  : "1px solid transparent",
                borderRadius: 10,
                cursor: "pointer",
                color: isActive
                  ? "var(--accent)"
                  : "rgba(240,217,181,0.55)",
                fontSize: 13, fontWeight: isActive ? 700 : 400,
                transition: "all 0.18s",
                marginBottom: 3,
                whiteSpace: "nowrap", overflow: "hidden",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
              {!collapsed && isActive && (
                <span style={{
                  marginLeft: "auto",
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 6px var(--accent)",
                }}/>
              )}
            </button>
          );
        })}

        {/* Back to Crypto */}
        <div style={{
          margin: "12px 0 0",
          borderTop: "1px solid rgba(240,217,181,0.06)",
          paddingTop: 12,
        }}>
          <button
            onClick={() => window.location.href = "/"}
            title={collapsed ? "Back to Crypto" : undefined}
            style={{
              width: "100%",
              display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 12,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "12px 0" : "11px 14px",
              background: "none",
              border: "1px solid rgba(240,217,181,0.08)",
              borderRadius: 10, cursor: "pointer",
              color: "rgba(240,217,181,0.35)",
              fontSize: 13, transition: "all 0.18s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--gold)";
              e.currentTarget.style.borderColor = "rgba(212,160,23,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(240,217,181,0.35)";
              e.currentTarget.style.borderColor = "rgba(240,217,181,0.08)";
            }}
          >
            <span style={{ fontSize: 17, flexShrink: 0 }}>₿</span>
            {!collapsed && <span>Back to Crypto</span>}
          </button>
        </div>
      </nav>

      {/* Footer — System Status */}
      <div style={{
        padding: collapsed ? "14px 8px" : "14px 16px",
        borderTop: "1px solid rgba(240,217,181,0.06)",
      }}>
        {!collapsed && (
          <div style={{
            display: "flex", alignItems: "center",
            gap: 8, marginBottom: 10,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 8px var(--green)",
              animation: "blink 2s ease-in-out infinite",
            }}/>
            <span style={{
              fontSize: 10, color: "rgba(240,217,181,0.5)",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>Live Trading</span>
          </div>
        )}

        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          style={{
            width: "100%",
            display: "flex", alignItems: "center",
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "10px 0" : "10px 12px",
            background: "rgba(198,40,40,0.08)",
            border: "1px solid rgba(198,40,40,0.18)",
            borderRadius: 9, cursor: "pointer",
            color: "rgba(198,40,40,0.65)",
            fontSize: 12, transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(198,40,40,0.15)";
            e.currentTarget.style.color = "var(--red)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(198,40,40,0.08)";
            e.currentTarget.style.color = "rgba(198,40,40,0.65)";
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>
    </aside>
  );
}