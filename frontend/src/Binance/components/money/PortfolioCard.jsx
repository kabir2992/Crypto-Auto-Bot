import {
  Coins,
  TrendingUp
} from "lucide-react";

const PortfolioCard = ({
  totalInvested = 0,
  solHolding = 0,
  averageBuyPrice = 0
}) => {

  return (

    <div className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-7
      shadow-2xl
    ">

      <div className="
        absolute
        -top-10
        -right-10
        w-40
        h-40
        rounded-full
        bg-cyan-500
        opacity-20
        blur-3xl
      " />

      <div className="
        relative
        z-10
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <div>

            <p className="
              text-sm
              uppercase
              tracking-widest
              text-slate-400
              mb-2
            ">

              Portfolio

            </p>

            <h2 className="
              text-4xl
              font-black
              text-cyan-400
            ">

              ${Number(totalInvested).toFixed(2)}

            </h2>

          </div>

          <div className="
            w-16
            h-16
            rounded-2xl
            bg-cyan-500/20
            flex
            items-center
            justify-center
          ">

            <Coins
              size={32}
              className="
                text-cyan-400
              "
            />

          </div>

        </div>

        <div className="
          space-y-5
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <span className="
              text-slate-400
            ">

              SOL Holdings

            </span>

            <span className="
              text-white
              font-bold
            ">

              {Number(solHolding).toFixed(4)}

            </span>

          </div>

          <div className="
            flex
            items-center
            justify-between
          ">

            <span className="
              text-slate-400
            ">

              Average Buy

            </span>

            <span className="
              text-emerald-400
              font-bold
            ">

              ${Number(averageBuyPrice).toFixed(2)}

            </span>

          </div>

          <div className="
            flex
            items-center
            justify-between
          ">

            <span className="
              text-slate-400
            ">

              Market Status

            </span>

            <div className="
              flex
              items-center
              gap-2
              text-emerald-400
              font-semibold
            ">

              <TrendingUp size={16} />

              Active

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default PortfolioCard;