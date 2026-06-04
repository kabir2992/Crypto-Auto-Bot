import {
  Wallet,
  AlertTriangle
} from "lucide-react";

const BalanceCard = ({
  balance = 0,
  warning = false
}) => {

  return (

    <div className={`
      relative
      overflow-hidden
      rounded-3xl
      border
      backdrop-blur-xl
      p-7
      shadow-2xl
      transition-all
      duration-300

      ${
        warning
          ? `
            border-red-500/40
            bg-red-500/10
            animate-pulse
          `
          : `
            border-white/10
            bg-white/5
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
          warning
            ? "bg-red-500"
            : "bg-emerald-500"
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
          mb-6
        ">

          <div>

            <p className="
              text-sm
              uppercase
              tracking-widest
              text-slate-400
              mb-2
            ">

              Available Balance

            </p>

            <h2 className={`
              text-5xl
              font-black

              ${
                warning
                  ? "text-red-400"
                  : "text-emerald-400"
              }
            `}>

              ${Number(balance).toFixed(2)}

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
              warning
                ? "bg-red-500/20"
                : "bg-emerald-500/20"
            }
          `}>

            {
              warning
                ? (
                  <AlertTriangle
                    size={32}
                    className="text-red-400"
                  />
                )
                : (
                  <Wallet
                    size={32}
                    className="text-emerald-400"
                  />
                )
            }

          </div>

        </div>

        {
          warning && (

            <div className="
              mt-4
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              p-4
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <AlertTriangle
                  className="
                    text-red-400
                  "
                  size={20}
                />

                <p className="
                  text-red-300
                  font-semibold
                  tracking-wide
                ">

                  Insufficient Balance

                </p>

              </div>

              <p className="
                text-sm
                text-red-200/80
                mt-2
                leading-6
              ">

                Your trading balance is below $10.
                Add more funds to continue smooth trading operations.

              </p>

            </div>

          )
        }

      </div>

    </div>

  );

};

export default BalanceCard;