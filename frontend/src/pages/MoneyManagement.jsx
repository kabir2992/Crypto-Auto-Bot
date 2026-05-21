import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import BotData from "../hooks/useBotState";

const MoneyManagement = () => {

  const { botState } = BotData();

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-black text-white">
          Money Management
        </h1>

        <p className="text-gray-400 mt-2">
          Manage investment and profits
        </p>
      </div>

      {/* WARNING */}
      {botState?.balanceWarning && (

        <div className="
          p-5 rounded-3xl
          bg-red-500/10
          border border-red-500/30
        ">
          <h2 className="text-red-300 text-xl font-bold">
            Insufficient Balance
          </h2>

          <p className="text-red-200 mt-2">
            Add more funds to continue trading.
          </p>
        </div>

      )}

      {/* CARDS */}
      <div className="
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        <div className="bg-[#0B1120] rounded-3xl p-6 border border-white/10">
          <Wallet className="text-cyan-300 mb-4" />
          <p className="text-gray-400">Available Balance</p>
          <h2 className="text-3xl font-black text-white">
            ${botState?.availableBalance?.toFixed(2)}
          </h2>
        </div>

        <div className="bg-[#0B1120] rounded-3xl p-6 border border-white/10">
          <TrendingUp className="text-green-400 mb-4" />
          <p className="text-gray-400">Total Profit</p>
          <h2 className="text-3xl font-black text-green-400">
            ${botState?.totalProfit?.toFixed(2)}
          </h2>
        </div>

        <div className="bg-[#0B1120] rounded-3xl p-6 border border-white/10">
          <TrendingDown className="text-red-400 mb-4" />
          <p className="text-gray-400">Total Loss</p>
          <h2 className="text-3xl font-black text-red-400">
            ${botState?.totalLoss?.toFixed(2)}
          </h2>
        </div>

        <div className="bg-[#0B1120] rounded-3xl p-6 border border-white/10">
          <Wallet className="text-yellow-300 mb-4" />
          <p className="text-gray-400">Invested Amount</p>
          <h2 className="text-3xl font-black text-yellow-300">
            ${botState?.totalInvestedAmount?.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* BUTTON */}
      <button
        className="
          px-8 py-4 rounded-2xl
          bg-cyan-500 hover:bg-cyan-400
          text-black font-bold
          transition
        "
      >
        Add Funds
      </button>
    </div>
  );
};

export default MoneyManagement;