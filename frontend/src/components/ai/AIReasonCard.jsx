import {
  BrainCircuit
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

const AIReasonCard = ({
  reasons = []
}) => {

  return (

    <GlassCard className="
      p-7
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        gap-4
        mb-8
      ">

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-cyan-500/10
          border
          border-cyan-400/10
          flex
          items-center
          justify-center
        ">

          <BrainCircuit
            className="
              text-cyan-300
            "
            size={28}
          />

        </div>

        <div>

          <h2 className="
            text-3xl
            font-black
            text-white
          ">

            AI Reasoning

          </h2>

          <p className="
            text-slate-400
          ">

            Why AI selected this strategy

          </p>

        </div>

      </div>

      {/* REASONS */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-5
      ">

        {
          reasons.map(
            (reason, index) => (

              <div
                key={index}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-5
                  hover:border-cyan-400/20
                  transition-all
                "
              >

                <div className="
                  flex
                  items-start
                  gap-4
                ">

                  <div className="
                    min-w-[42px]
                    h-[42px]
                    rounded-2xl
                    bg-cyan-500/10
                    border
                    border-cyan-400/10
                    flex
                    items-center
                    justify-center
                    text-cyan-300
                    font-black
                  ">

                    {index + 1}

                  </div>

                  <p className="
                    text-slate-300
                    leading-8
                  ">

                    {reason}

                  </p>

                </div>

              </div>

            )
          )
        }

      </div>

    </GlassCard>

  );

};

export default AIReasonCard;