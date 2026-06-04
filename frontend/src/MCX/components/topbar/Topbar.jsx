export default function Topbar({
  selected,
  setSelected,
  commodities,
  livePrice
}) {
  return (
    <div className="h-16 ml-64 flex items-center justify-between px-6 bg-black border-b border-orange-500/20">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <div className="text-green-400 font-bold">
          {selected}: ₹ {livePrice?.price || 0}
        </div>

        <select
          className="bg-black border border-orange-500/30 px-3 py-1 rounded-lg"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {commodities.map((c) => (
            <option key={c.symbol} value={c.symbol}>
              {c.symbol}
            </option>
          ))}
        </select>

      </div>

      {/* RIGHT */}
      <div className="text-orange-300">
        Live MCX System
      </div>

    </div>
  );
}