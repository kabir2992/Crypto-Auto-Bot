import React from "react";

const LivePriceBadge = ({ price }) => {

  const formattedPrice =
    Number(price || 0).toFixed(2);

  return (

    <div className="
      flex items-center gap-3
      bg-emerald-500/10
      border border-emerald-400/20
      rounded-2xl
      px-4 py-3
      backdrop-blur-xl
      shadow-lg
      shadow-emerald-500/10
    ">

      <div className="
        h-3 w-3 rounded-full
        bg-emerald-400
        animate-pulse
      " />

      <div>

        <p className="
          text-xs text-gray-400
        ">
          LIVE PRICE
        </p>

        <h2 className="
          text-lg font-bold text-emerald-300
        ">
          ${formattedPrice}
        </h2>

      </div>

    </div>

  );

};

export default LivePriceBadge;