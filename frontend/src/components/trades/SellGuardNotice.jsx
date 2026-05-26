import {
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value || 0));

const SellGuardNotice = ({
  botState,
  livePrice
}) => {
  const minimumSellPrice =
    Number(botState?.minimumSellPrice || 0);

  const currentPrice =
    Number(livePrice || 0);

  const holding =
    Number(botState?.solHolding || 0);

  if (
    holding <= 0 ||
    minimumSellPrice <= 0
  ) {
    return null;
  }

  const isBlocked =
    currentPrice > 0 &&
    currentPrice < minimumSellPrice;

  const difference =
    Math.abs(minimumSellPrice - currentPrice);

  return (

    <div className={`
      mb-6
      rounded-3xl
      border
      p-5
      backdrop-blur-xl
      shadow-2xl

      ${
        isBlocked
          ? "border-yellow-500/25 bg-yellow-500/10"
          : "border-emerald-500/25 bg-emerald-500/10"
      }
    `}>

      <div className="
        flex
        flex-col
        gap-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">

        <div className="
          flex
          items-start
          gap-4
        ">

          <div className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl

            ${
              isBlocked
                ? "bg-yellow-400/15 text-yellow-300"
                : "bg-emerald-400/15 text-emerald-300"
            }
          `}>

            {
              isBlocked
                ? <ShieldAlert size={24} />
                : <ShieldCheck size={24} />
            }

          </div>

          <div>

            <p className={`
              text-xs
              font-black
              uppercase
              tracking-widest

              ${
                isBlocked
                  ? "text-yellow-300"
                  : "text-emerald-300"
              }
            `}>

              {
                isBlocked
                  ? "Sell Guard Active"
                  : "Profit Sell Unlocked"
              }

            </p>

            <h3 className="
              mt-2
              text-2xl
              font-black
              text-white
            ">

              {
                isBlocked
                  ? "SELL is blocked until price reaches the safe exit level."
                  : "Current price is above the protected sell level."
              }

            </h3>

            <p className="
              mt-2
              text-sm
              leading-6
              text-slate-400
            ">

              Holding {holding.toFixed(4)} SOL. Minimum sell price is based on your average buy price plus the configured profit buffer.

            </p>

          </div>

        </div>

        <div className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-3
          lg:min-w-[520px]
        ">

          <div className="
            rounded-2xl
            border
            border-white/10
            bg-black/20
            p-4
          ">

            <p className="
              text-xs
              uppercase
              tracking-widest
              text-slate-500
            ">
              Live Price
            </p>

            <p className="
              mt-2
              text-xl
              font-black
              text-cyan-300
            ">
              {formatCurrency(currentPrice)}
            </p>

          </div>

          <div className="
            rounded-2xl
            border
            border-white/10
            bg-black/20
            p-4
          ">

            <p className="
              text-xs
              uppercase
              tracking-widest
              text-slate-500
            ">
              Safe Sell
            </p>

            <p className="
              mt-2
              text-xl
              font-black
              text-white
            ">
              {formatCurrency(minimumSellPrice)}
            </p>

          </div>

          <div className="
            rounded-2xl
            border
            border-white/10
            bg-black/20
            p-4
          ">

            <p className="
              text-xs
              uppercase
              tracking-widest
              text-slate-500
            ">
              Gap
            </p>

            <p className={`
              mt-2
              text-xl
              font-black

              ${
                isBlocked
                  ? "text-yellow-300"
                  : "text-emerald-300"
              }
            `}>
              {formatCurrency(difference)}
            </p>

          </div>

        </div>

      </div>

    </div>

  );
};

export default SellGuardNotice;
