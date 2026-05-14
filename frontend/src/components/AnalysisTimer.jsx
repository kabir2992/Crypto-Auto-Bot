import { useEffect, useState } from "react";

const AnalysisTimer = ({
    nextAnalysisTime,
    lastAction
}) => {

    const [timeLeft, setTimeLeft] =
        useState("");

    useEffect(() => {

        if (!nextAnalysisTime) return;

        const interval = setInterval(() => {

            const now = new Date();

            const target =
                new Date(nextAnalysisTime);

            const difference =
                target - now;

            if (difference <= 0) {

                setTimeLeft(
                    "Analyzing..."
                );

                return;
            }

            const hours =
                Math.floor(
                    difference / (1000 * 60 * 60)
                );

            const minutes =
                Math.floor(
                    (difference % (1000 * 60 * 5))
                    / (1000 * 60)
                );

            const seconds =
                Math.floor(
                    (difference % (1000 * 60))
                    / 1000
                );

            setTimeLeft(
                `${hours}h ${minutes}m ${seconds}s`
            );

        }, 1000);

        return () =>
            clearInterval(interval);

    }, [nextAnalysisTime]);

    if (lastAction === "SELL") {
        const title = lastAction === "SELL" ? "Waiting For Next Cycle" : "Next Analysis";
    }

    return (

        <div className="
      bg-gradient-to-r
      from-purple-600
      to-blue-600
      p-6
      rounded-3xl
      shadow-2xl
      mb-8
    ">

            <h2 className="
        text-xl
        font-semibold
        mb-2
      ">

                Next Analysis

            </h2>

            <p className="
        text-5xl
        font-bold
      ">

                {timeLeft}

            </p>

        </div>

    );

};

export default AnalysisTimer;