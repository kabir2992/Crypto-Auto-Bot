import { useState, useEffect } from "react";
import { formatSymbol, formatBase, extractBase } from "../utils/formatSymbol";
import LoadingScreen from "../components/LoadingScreen";
import API from "../api/axios";

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 46, height: 26, borderRadius: 13,
      border: "none", cursor: "pointer",
      position: "relative",
      background: value
        ? "linear-gradient(135deg,var(--accent),var(--gold))"
        : "var(--border)",
      transition: "background 0.3s",
      boxShadow: value ? "0 2px 8px rgba(232,97,10,0.35)" : "none",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3,
        left: value ? "calc(100% - 23px)" : "3px",
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff",
        transition: "left 0.28s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }}/>
    </button>
  );
}

export default function Settings({ symbols = [] }) {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    API.get("/setting")
      .then(r => r.data)
      .then(d => { if (d.success) setSettings(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const toggleCommodity = (sym) => {
    if (!settings) return;
    const cur  = settings.selectedCommodities || [];
    const next = cur.includes(sym)
      ? cur.filter(s => s !== sym)
      : [...cur, sym];
    setSettings(p => ({ ...p, selectedCommodities: next }));
  };

  const setPref = (k, v) => setSettings(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await API.put("/setting",
        settings
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ height: 300, position: "relative" }}>
      <div style={{ transform: "scale(0.55)", transformOrigin: "top center" }}>
        <LoadingScreen message="Loading settings..."/>
      </div>
    </div>
  );

  // Group by base
  const grouped = {};
  symbols.forEach(sym => {
    const base = extractBase(sym);
    if (!grouped[base]) grouped[base] = [];
    grouped[base].push(sym);
  });

  const selected = settings?.selectedCommodities || [];

  return (
    <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Commodity Selector */}
      <div style={{
        background: "var(--bg-card)", borderRadius: 20,
        padding: 28, border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 700,
          color: "var(--text)", marginBottom: 6,
        }}>📦 Commodities to Trade</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
          Select the contracts your bot will actively trade.
          {selected.length > 0 && (
            <span style={{ color: "var(--accent)", fontWeight: 600, marginLeft: 8 }}>
              {selected.length} selected
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.entries(grouped).map(([base, fulls]) => {
            const anySelected = fulls.some(f => selected.includes(f));
            return (
              <div key={base} style={{
                background: anySelected ? "rgba(232,97,10,0.04)" : "var(--bg-2)",
                borderRadius: 14,
                border: anySelected
                  ? "1px solid rgba(232,97,10,0.18)"
                  : "1px solid var(--border)",
                padding: "14px 16px",
                transition: "all 0.2s",
              }}>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: anySelected ? "var(--accent)" : "var(--text)",
                  marginBottom: 10,
                }}>
                  {formatBase(base + "FUT") || base}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {fulls.map(sym => {
                    const isSel = selected.includes(sym);
                    return (
                      <button key={sym} onClick={() => toggleCommodity(sym)}
                        style={{
                          padding: "6px 12px", borderRadius: 8,
                          border: `1.5px solid ${isSel ? "var(--accent)" : "var(--border)"}`,
                          background: isSel ? "rgba(232,97,10,0.12)" : "var(--bg-card)",
                          color: isSel ? "var(--accent)" : "var(--text-muted)",
                          cursor: "pointer", fontSize: 11,
                          fontWeight: isSel ? 700 : 400,
                          transition: "all 0.18s",
                        }}
                        onMouseEnter={e => {
                          if (!isSel) e.currentTarget.style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={e => {
                          if (!isSel) e.currentTarget.style.borderColor = "var(--border)";
                        }}
                      >
                        {formatSymbol(sym)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trading Preferences */}
      <div style={{
        background: "var(--bg-card)", borderRadius: 20,
        padding: 28, border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 700,
          color: "var(--text)", marginBottom: 20,
        }}>⚙️ Trading Preferences</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { k: "allowLongTrades",  l: "Allow Long Trades",  desc: "Bot can open LONG positions"   },
            { k: "allowShortTrades", l: "Allow Short Trades", desc: "Bot can open SHORT positions"  },
            { k: "autoCompound",     l: "Auto Compound",      desc: "Reinvest profits automatically"},
          ].map(f => (
            <div key={f.k} style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "var(--bg-2)",
              borderRadius: 12, border: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                  {f.l}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {f.desc}
                </div>
              </div>
              <Toggle
                value={!!settings?.[f.k]}
                onChange={v => setPref(f.k, v)}
              />
            </div>
          ))}

          {/* Number inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { k: "maxOpenPositions",    l: "Max Open Positions", def: 10 },
              { k: "dailyLossLimitPercent", l: "Daily Loss Limit %", def: 15 },
            ].map(f => (
              <div key={f.k} style={{
                padding: "14px 16px",
                background: "var(--bg-2)",
                borderRadius: 12, border: "1px solid var(--border)",
              }}>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 700,
                  color: "var(--text-muted)", marginBottom: 8,
                  textTransform: "uppercase", letterSpacing: "0.09em",
                }}>{f.l}</label>
                <input
                  type="number"
                  value={settings?.[f.k] ?? f.def}
                  onChange={e => setPref(f.k, +e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px",
                    background: "var(--bg-card)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 9, fontSize: 15, fontWeight: 700,
                    color: "var(--text)", outline: "none",
                    boxSizing: "border-box", fontFamily: "'JetBrains Mono',monospace",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button onClick={save} disabled={saving} style={{
          padding: "14px 36px",
          background: saved
            ? "linear-gradient(135deg,var(--green),#388E3C)"
            : "linear-gradient(135deg,var(--accent),var(--gold))",
          border: "none", borderRadius: 12,
          fontSize: 15, fontWeight: 700, color: "#fff",
          cursor: saving ? "not-allowed" : "pointer",
          boxShadow: "0 4px 18px rgba(232,97,10,0.4)",
          transition: "all 0.3s", opacity: saving ? 0.75 : 1,
          letterSpacing: "0.02em",
        }}>
          {saving ? "Saving…" : saved ? "✅ Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}