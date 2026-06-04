import {
  TrendingUp,
  TrendingDown
} from "lucide-react";

const ProfitCard = ({
  totalProfit = 0,
  totalLoss = 0,
  realTotalProfit = 0
}) => {

  const netProfit = realTotalProfit;

  const positive = netProfit >= 0;

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

      <div className={`
        absolute
        -top-10
        -right-10
        w-40
        h-40
        rounded-full
        blur-3xl
        opacity-20

        ${
          positive
            ? "bg-emerald-500"
            : "bg-red-500"
        }
      `} />

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

              Net Profit

            </p>

            <h2 className={`
              text-5xl
              font-black

              ${
                positive
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}>

              ${Math.abs(realTotalProfit).toFixed(2)}

            </h2>

          </div>

          <div className={`
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center

            ${
              positive
                ? "bg-emerald-500/20"
                : "bg-red-500/20"
            }
          `}>

            {
              positive
                ? (
                  <TrendingUp
                    size={32}
                    className="
                      text-emerald-400
                    "
                  />
                )
                : (
                  <TrendingDown
                    size={32}
                    className="
                      text-red-400
                    "
                  />
                )
            }

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

              Total Profit

            </span>

            <span className="
              text-emerald-400
              font-bold
            ">

              +${Number(totalProfit).toFixed(2)}

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

              Total Loss

            </span>

            <span className="
              text-red-400
              font-bold
            ">

              -${Number(totalLoss).toFixed(2)}

            </span>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProfitCard;