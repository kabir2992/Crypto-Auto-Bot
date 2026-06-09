/**
 * Formats a number as Indian rupee string
 * 1234567.89 → "₹12,34,567.89"
 */
export function formatRupee(value, decimals = 2) {
  if (value == null || isNaN(value)) return "₹—";
  return (
    "₹" +
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

/**
 * Compact format for large numbers
 * 1234567 → "₹12.3L"
 */
export function formatRupeeCompact(value) {
  if (value == null || isNaN(value)) return "₹—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`;
  return formatRupee(value);
}

/**
 * P&L with color class
 */
export function getPnLColor(value) {
  if (value > 0) return "var(--green)";
  if (value < 0) return "var(--red)";
  return "var(--text-muted)";
}