export default function MiniLineChart({ data = [], color = "var(--accent)", height = 48 }) {
  if (!data || data.length < 2) return null;

  const W = 120;
  const vals = data.map(d => (typeof d === "number" ? d : d.y));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = height - 4 - ((v - min) / range) * (height - 8);
    return `${x},${y}`;
  }).join(" ");

  const id = `sg-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      width={W} height={height}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`0,${height} ${pts} ${W},${height}`}
        fill={`url(#${id})`}
      />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}