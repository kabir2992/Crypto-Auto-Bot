import { useEffect, useRef, useState, useCallback } from "react";
import { formatSymbol } from "../utils/formatSymbol";
import { formatRupee } from "../utils/formatRupee";
import LoadingScreen from "./LoadingScreen";
import API from "../api/axios";

const COLORS = {
  price: "#FF7A1A",
  ema20: "#C87EFF",
  ema50: "#5AC8FA",
  ema200: "#FFD700",
  rsi: "#4CAF50",
  macd: "#FF7A1A",
  signal: "#5AC8FA",
  hist_pos: "rgba(76,175,80,0.65)",
  hist_neg: "rgba(239,83,80,0.65)",
};

function drawChart(canvas, data, hovered, isDark) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // Increased right padding to prevent Y-axis labels from being cut off
  const PAD = { top: 20, right: 95, bottom: 52, left: 96 };
  const MAIN_H = Math.floor((H - PAD.top - PAD.bottom) * 0.63);
  const RSI_H  = Math.floor((H - PAD.top - PAD.bottom) * 0.17);
  const MACD_H = Math.floor((H - PAD.top - PAD.bottom) * 0.18);
  const GAP = 10;

  const MAIN_TOP = PAD.top;
  const RSI_TOP  = MAIN_TOP + MAIN_H + GAP;
  const MACD_TOP = RSI_TOP + RSI_H + GAP;

  const cW = W - PAD.left - PAD.right;

  const bg   = isDark ? "#0F0804" : "#FFFCF5";
  const grid = isDark ? "rgba(46,28,8,0.85)" : "rgba(232,197,154,0.4)";
  const textColor = isDark ? "#9A7050" : "#7A5C3A";
  const sep  = isDark ? "rgba(46,28,8,0.9)" : "rgba(220,185,130,0.6)";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (!data || data.length < 5) return;

  const closes = data.map(d => d.close).filter(Boolean);
  const minP = Math.min(...closes) * 0.999;
  const maxP = Math.max(...closes) * 1.001;
  const rangeP = maxP - minP || 1;

  const toX = i => PAD.left + (i / (data.length - 1)) * cW;
  const toY = (v, top, h, min, max) => top + h - ((v - min) / (max - min || 1)) * h;

  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textBaseline = "middle";

  // ── Main Price Grid + Y-axis Labels ─────────────────────
  for (let i = 0; i <= 5; i++) {
    const y = MAIN_TOP + (i / 5) * MAIN_H;
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(W - PAD.right, y);
    ctx.strokeStyle = grid;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    const val = maxP - (i / 5) * rangeP;
    ctx.fillStyle = textColor;
    ctx.textAlign = "right";
    ctx.fillText("₹" + val.toLocaleString("en-IN"), PAD.left - 10, y + 1);
  }

  // ── Separators ──────────────────────────────────────────
  [RSI_TOP, MACD_TOP].forEach(top => {
    ctx.beginPath();
    ctx.moveTo(PAD.left, top);
    ctx.lineTo(W - PAD.right, top);
    ctx.strokeStyle = sep;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  // RSI & MACD Labels
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.fillText("RSI", PAD.left + 6, RSI_TOP + 14);
  ctx.fillText("MACD", PAD.left + 6, MACD_TOP + 14);

  // RSI Levels
  [10, 30, 50, 70].forEach(level => {
    const y = toY(level, RSI_TOP, RSI_H, 0, 100);
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(W - PAD.right, y);
    ctx.strokeStyle = level === 50 ? sep : (level === 70 ? "rgba(239,83,80,0.3)" : "rgba(76,175,80,0.3)");
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.textAlign = "right";
    ctx.fillText(level.toString(), PAD.left - 10, y);
  });

  // ── Smart Time Axis (unchanged but with more bottom padding) ──
  const step = Math.max(1, Math.ceil(data.length / 8));
  data.forEach((d, i) => {
    if (i % step !== 0) return;
    const x = toX(i);
    const date = new Date(d.time);
    let label = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    if (i === 0 || date.getDate() !== new Date(data[i - step]?.time || 0).getDate()) {
      label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " " + label;
    }

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText(label, x, H - 18);
  });

  // ── Draw Functions ──────────────────────────────────────
  const drawLine = (key, color, width, dash = [], top, h, min, max) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    let started = false;

    data.forEach((d, i) => {
      if (d[key] == null) return;
      const x = toX(i);
      const y = toY(d[key], top, h, min, max);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // EMA Lines
  drawLine("ema200", COLORS.ema200, 1.8, [8, 4], MAIN_TOP, MAIN_H, minP, maxP);
  drawLine("ema50", COLORS.ema50, 1.6, [4, 3], MAIN_TOP, MAIN_H, minP, maxP);
  drawLine("ema20", COLORS.ema20, 1.6, [2, 2], MAIN_TOP, MAIN_H, minP, maxP);

  // Price Area + Line
  ctx.beginPath();
  data.forEach((d, i) => {
    if (!d.close) return;
    const x = toX(i);
    const y = toY(d.close, MAIN_TOP, MAIN_H, minP, maxP);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(toX(data.length - 1), MAIN_TOP + MAIN_H);
  ctx.lineTo(PAD.left, MAIN_TOP + MAIN_H);
  const grad = ctx.createLinearGradient(0, MAIN_TOP, 0, MAIN_TOP + MAIN_H);
  grad.addColorStop(0, "rgba(255,122,26,0.28)");
  grad.addColorStop(1, "rgba(255,122,26,0.02)");
  ctx.fillStyle = grad;
  ctx.fill();

  drawLine("close", COLORS.price, 2.8, [], MAIN_TOP, MAIN_H, minP, maxP);

  // RSI
  if (data.some(d => d.rsi != null)) {
    drawLine("rsi", COLORS.rsi, 1.8, [], RSI_TOP, RSI_H, 0, 100);
  }

  // MACD
  if (data.some(d => d.macdHistogram != null)) {
    const macdValues = data.flatMap(d => [d.macd, d.macdSignal, d.macdHistogram]).filter(Boolean);
    const macdMin = Math.min(...macdValues);
    const macdMax = Math.max(...macdValues);
    const barW = Math.max(2, cW / data.length - 2);

    data.forEach((d, i) => {
      if (d.macdHistogram == null) return;
      const x = toX(i);
      const zeroY = toY(0, MACD_TOP, MACD_H, macdMin, macdMax);
      const y = toY(d.macdHistogram, MACD_TOP, MACD_H, macdMin, macdMax);

      ctx.fillStyle = d.macdHistogram >= 0 ? COLORS.hist_pos : COLORS.hist_neg;
      ctx.fillRect(x - barW / 2, Math.min(y, zeroY), barW, Math.abs(y - zeroY));
    });

    drawLine("macd", COLORS.macd, 1.4, [], MACD_TOP, MACD_H, macdMin, macdMax);
    drawLine("macdSignal", COLORS.signal, 1.4, [], MACD_TOP, MACD_H, macdMin, macdMax);
  }

  // ── Enhanced Crosshair ─────────────────────────────────────
  if (hovered != null && data[hovered]) {
    const d = data[hovered];
    const x = toX(hovered);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, PAD.top);
    ctx.lineTo(x, H - PAD.bottom);
    ctx.strokeStyle = "rgba(255,122,26,0.45)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Horizontal line on price
    if (d.close) {
      const y = toY(d.close, MAIN_TOP, MAIN_H, minP, maxP);
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(W - PAD.right, y);
      ctx.strokeStyle = "rgba(255,122,26,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Price dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = COLORS.price;
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();
    }
  }
}

export default function MainChart({ symbol }) {
  const canvasRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null);

  const fetch_ = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);

    try {
      const res = await API.get(`/mcxchart/${encodeURIComponent(symbol)}`);
      const json = res.data;

      if (json.success && json.data?.length) {
        setData(json.data);
      } else {
        setError(json.message || "No data available");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load chart");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => {
    const t = setInterval(fetch_, 90000); // 1.5 min
    return () => clearInterval(t);
  }, [fetch_]);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    drawChart(canvasRef.current, data, hovered, isDark);
  }, [data, hovered]);

  const handleMouseMove = (e) => {
    if (!data || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const PAD_LEFT = 72;
    const cW = canvasRef.current.width - PAD_LEFT - 80;
    let idx = Math.round(((x - PAD_LEFT) / cW) * (data.length - 1));
    idx = Math.max(0, Math.min(data.length - 1, idx));
    setHovered(idx);
  };

  const hd = hovered != null && data ? data[hovered] : data?.[data.length - 1];

  if (loading) return <div style={{ height: 480 /* loading style */ }}><LoadingScreen message="Loading chart..." /></div>;
  if (error) return <div style={{ height: 480, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)" }}>⚠️ {error}</div>;

  return (
    <div style={{ background: "var(--bg-card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
      {/* Header & Indicators */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{formatSymbol(symbol)}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>
            {hd ? formatRupee(hd.close) : "—"}
          </div>
        </div>

        {/* Indicators */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[
            { label: "EMA 20", value: hd?.ema20, color: COLORS.ema20 },
            { label: "EMA 50", value: hd?.ema50, color: COLORS.ema50 },
            { label: "EMA 200", value: hd?.ema200, color: COLORS.ema200 },
            { label: "RSI", value: hd?.rsi, color: hd?.rsi > 70 ? "var(--red)" : hd?.rsi < 30 ? "var(--green)" : "var(--text-muted)" },
            { label: "MACD", value: hd?.macd, color: hd?.macd >= 0 ? "var(--green)" : "var(--red)" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.5px" }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>
                {item.value != null ? Number(item.value).toFixed(2) : "—"}
              </div>
            </div>
          ))}
        </div>

        <button onClick={fetch_} style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          ↻ Refresh
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={1150}
        height={480}
        style={{ width: "100%", height: "auto", display: "block", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      />
    </div>
  );
}