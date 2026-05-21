import React, { useEffect, useState } from "react";

const AnalysisTimerBar = ({ nextAnalysisTime }) => {

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {

    const interval = setInterval(() => {

      if (!nextAnalysisTime) return;

      const difference =
        new Date(nextAnalysisTime) - new Date();

      if (difference <= 0) {
        setTimeLeft("Analyzing...");
        return;
      }

      const minutes =
        Math.floor(difference / (1000 * 60));

      const seconds =
        Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );

    }, 1000);

    return () => clearInterval(interval);

  }, [nextAnalysisTime]);

  return (

    <div className="
      w-full
      bg-cyan-500/10
      border border-cyan-400/20
      rounded-2xl
      p-4
      backdrop-blur-xl
      flex items-center justify-between
    ">

      <div>
        <p className="text-gray-400 text-sm">
          Next Market Analysis
        </p>

        <h2 className="
          text-cyan-300
          text-xl
          font-bold
        ">
          {timeLeft}
        </h2>
      </div>

      <div className="
        h-3 w-3 rounded-full
        bg-cyan-400 animate-pulse
      " />

    </div>

  );

};

export default AnalysisTimerBar;