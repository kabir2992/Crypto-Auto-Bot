import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarClock
} from "lucide-react";

const TradeCard = ({
  trade
}) => {
  const isBuy =  trade.side === "BUY";

  const positionSide =
    trade.positionSide ||
    (
      trade.side?.includes("SHORT")
        ? "SHORT"
        : "LONG"
    );

  return (

    <div className={`
      relative
      overflow-hidden
      rounded-3xl
      border
      p-6
      backdrop-blur-xl
      shadow-2xl
      transition-all
      duration-300
      hover:scale-[1.02]

      ${
        isBuy
          ? `
            border-emerald-500/20
            bg-emerald-500/10
          `
          : `
            border-red-500/20
            bg-red-500/10
          `
      }
    `}>

      {/* Glow */}

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
          isBuy
            ? "bg-emerald-500"
            : "bg-red-500"
        }
      `} />

      <div className="
        relative
        z-10
      ">

        {/* TOP */}

        <div className="
          flex
          items-start
          justify-between
          mb-6
        ">

          <div>

            <p className="
              text-xs
              tracking-widest
              uppercase
              text-slate-400
              mb-2
            ">

              {trade.symbol}

            </p>

            <h2 className={`
              text-4xl
              font-black

              ${
                isBuy
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}>

              {trade.side}

            </h2>

            <span className={`
              mt-3
              inline-flex
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-black
              tracking-widest

              ${
                positionSide === "LONG"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300"
              }
            `}>

              {positionSide}

            </span>

          </div>

          <div className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center

            ${
              isBuy
                ? "bg-emerald-500/20"
                : "bg-red-500/20"
            }
          `}>

            {
              isBuy
                ? (
                  <TrendingUp
                    className="
                      text-emerald-400
                    "
                  />
                )
                : (
                  <TrendingDown
                    className="
                      text-red-400
                    "
                  />
                )
            }

          </div>

        </div>

        {/* BODY */}

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

              Quantity

            </span>

            <span className="
              text-white
              font-bold
            ">

              {Number(trade.quantity).toFixed(4)}

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

              Price

            </span>

            <span className="
              text-cyan-400
              font-bold
            ">

              ${Number(trade.price).toFixed(2)}

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

              Profit

            </span>

            <span className={`
              font-bold

              ${
                trade.profit >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}>

              ${Number(trade.profit).toFixed(2)}

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

              Status

            </span>

            <span className="
              rounded-full
              bg-white/10
              px-3
              py-1
              text-xs
              font-semibold
              text-white
            ">

              {trade.status}

            </span>

          </div>

        </div>

        {/* FOOTER */}

        <div className="
          mt-6
          flex
          items-center
          gap-3
          text-sm
          text-slate-400
        ">

          <CalendarClock size={16} />

          {
            new Date(
              trade.createdAt
            ).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata"
            })
          }

        </div>

      </div>

    </div>

  );

};

export default TradeCard;
