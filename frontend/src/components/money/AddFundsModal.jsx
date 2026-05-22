import { useState } from "react";
import { X, Wallet, Plus } from "lucide-react";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const AddFundsModal = ({ open, onClose, onAddFunds, loading = false }) => {
  const [amount, setAmount] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;
    onAddFunds(parsed);
    setAmount("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#07111F] p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)]">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
            <Wallet size={32} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Add Trading Funds</h2>
            <p className="text-slate-400 mt-1">Increase balance for trading operations</p>
          </div>
        </div>

        {/* QUICK AMOUNTS */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              className={`rounded-2xl py-3 text-sm font-bold border transition-all duration-200
                ${amount === String(q)
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
            >
              ${q}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <div className="mb-8">
          <label className="block text-slate-300 mb-3 font-semibold">Custom Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
            <input
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pl-9 text-white outline-none transition focus:border-cyan-400 focus:bg-white/10"
            />
          </div>
          {amount && Number(amount) > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              New balance will increase by <span className="text-cyan-300 font-bold">${Number(amount).toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading || !amount || Number(amount) <= 0}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Plus size={20} />
              Add Funds
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default AddFundsModal;