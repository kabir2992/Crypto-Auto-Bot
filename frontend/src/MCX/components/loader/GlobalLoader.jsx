export default function GlobalLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60">

      <div className="relative w-40 h-40">

        {/* Outer Circle */}
        <div className="w-full h-full border-4 border-[#D4AF37] rounded-full animate-spin" />

        {/* Inner animation */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🪙 🥈 🛢
        </div>

      </div>

    </div>
  );
}