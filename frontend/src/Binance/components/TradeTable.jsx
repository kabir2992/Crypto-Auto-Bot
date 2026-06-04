const TradeTable = ({ trades }) => {
  const tradeList = Array.isArray(trades) ? trades : [];

  const getPositionSide = (trade) => {
    if (trade.positionSide) return trade.positionSide;
    return trade.side?.includes("SHORT") ? "SHORT" : "LONG";
  };

  const fmt = (n) =>
    "$" +
    Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const fmtTime = (ts) =>
    new Date(ts).toLocaleString("en-IN", {
      timezone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

  const totalBought = tradeList
    .filter((t) => t.side === "BUY")
    .reduce((sum, t) => sum + t.price * t.quantity, 0);

  const totalSold = tradeList
    .filter((t) => t.side === "SELL")
    .reduce((sum, t) => sum + t.price * t.quantity, 0);

  const netProfit = tradeList.reduce((sum, t) => sum + (t.realTotalProfit || 0), 0);

  const summaryCards = [
    { label: "Total Trades", value: tradeList.length, color: "blue" },
    { label: "Total Bought", value: fmt(totalBought), color: "green" },
    { label: "Total Sold", value: fmt(totalSold), color: "red" },
    {
      label: "Net Profit",
      value: (netProfit >= 0 ? "+" : "") + fmt(netProfit),
      color: netProfit > 0 ? "green" : netProfit < 0 ? "red" : null,
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Trade History</h2>
        <span className="text-xs text-white/50 bg-white/10 border border-white/10 rounded-full px-3 py-1">
          {tradeList.length} trades
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {summaryCards.map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
          >
            <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">
              {label}
            </p>
            <p
              className={`text-lg font-bold ${
                color === "green"
                  ? "text-emerald-400"
                  : color === "red"
                  ? "text-red-400"
                  : "text-white"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {["Side", "Position", "Price", "Qty", "Bought", "Sold", "Profit", "Time"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] uppercase tracking-widest text-white/40 font-semibold"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {tradeList.map((trade, i) => {
              const isBuy = trade.side === "BUY";
              const pos = getPositionSide(trade);
              const amt = trade.price * trade.quantity;
              const profit = trade.profit || 0;

              return (
                <tr
                  key={trade._id || i}
                  className="border-b border-white/5 hover:bg-white/5 transition-all"
                >
                  {/* Side */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-widest ${
                        isBuy
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-red-400/30 bg-red-400/10 text-red-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isBuy ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      {trade.side}
                    </span>
                  </td>

                  {/* Position */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-widest ${
                        pos === "LONG"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300"
                      }`}
                    >
                      {pos}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-white/80">{fmt(trade.price || 0)}</td>

                  {/* Qty */}
                  <td className="px-4 py-3 text-white/80">{trade.quantity || 0}</td>

                  {/* Bought */}
                  <td className="px-4 py-3">
                    {isBuy ? (
                      <span className="text-emerald-400 font-medium">{fmt(amt)}</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>

                  {/* Sold */}
                  <td className="px-4 py-3">
                    {!isBuy ? (
                      <span className="text-red-400 font-medium">{fmt(amt)}</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>

                  {/* Profit */}
                  <td className="px-4 py-3 font-semibold">
                    {profit > 0 ? (
                      <span className="text-emerald-400">+{fmt(profit)}</span>
                    ) : profit < 0 ? (
                      <span className="text-red-400">{fmt(profit)}</span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 text-white/40 text-xs">
                    {fmtTime(trade.createdAt)}
                  </td>
                </tr>
              );
            })}

            {tradeList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-white/30 text-sm">
                  No trades yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeTable;