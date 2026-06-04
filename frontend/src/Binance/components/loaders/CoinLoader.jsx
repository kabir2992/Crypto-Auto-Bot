import React from "react";

export default function CoinLoader({ message = "GETTING YOUR DATA , HOLD ON..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-200 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-32 h-32 mb-6">
        
        {/* Outer Tech Aura Rings */}
        <div className="absolute inset-0 border-4 border-dashed border-indigo-500/30 rounded-full animate-spin [animation-duration:10s]"></div>
        <div className="absolute inset-2 border border-dashed border-emerald-500/20 rounded-full animate-spin [animation-duration:6s] [animation-direction:reverse]"></div>
        
        {/* The 3D Spinning Crypto Coin Element */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.4)] border-2 border-amber-300 flex items-center justify-center animate-bounce [animation-duration:2.5s] relative overflow-hidden">
          
          {/* Inner Coin Engraving Layer */}
          <div className="absolute inset-1.5 rounded-full border border-amber-200/40 flex items-center justify-center bg-amber-500/10 backdrop-blur-xs">
            <span className="text-3xl font-black text-amber-100 select-none tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse">
              ₿
            </span>
          </div>

          {/* Shimmer Light Reflection Pass */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>

      {/* Terminal Loading Message Text Layout */}
      <div className="space-y-1.5 text-center">
        <p className="text-[10px] font-mono tracking-[0.3em] font-black text-indigo-400 uppercase animate-pulse">
          {message}
        </p>
        <div className="w-48 h-[2px] bg-slate-900 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 w-full rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>

      {/* Quick Tailwind Keyframe Style Injector */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}