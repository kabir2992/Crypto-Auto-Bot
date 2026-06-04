const StatCard = ({ title, value, color, warning = false, warningMessage = "" }) => {

  return (

    <div
      className={`
        relative
        overflow-hidden

        bg-white/5
        backdrop-blur-xl

        border

        ${warning
          ? "border-red-500 shadow-red-500/30 animate-pulse"
          : "border-white/10"
        }

        rounded-3xl
        p-6

        shadow-2xl

        hover:scale-105
        transition-all
        duration-300
      `}
    >

      {/* Glow Effect */}
      <div
        className={`
          absolute
          inset-0
          opacity-20
          blur-3xl

          ${warning
            ? "bg-red-500"
            : "bg-indigo-500"
          }
        `}
      />

      {/* Content */}
      <div className="relative z-10">

        <p className="
          text-gray-400
          mb-3
          text-sm
          tracking-wide
        ">

          {title}

        </p>

        <h2
          className={`
            text-4xl
            font-bold
            ${color}
          `}
        >

          {value}

        </h2>

        {/* Warning */}
        {
          warning && (

            <div className="
              mt-4
              flex
              items-center
              gap-2
              text-red-400
              text-sm
              font-medium
            ">

              <span className="
                w-2
                h-2
                rounded-full
                bg-red-500
              " />

              <p>
                {
                  warningMessage ||
                  "Insufficient Balance"
                }
              </p>

            </div>

          )
        }

      </div>

    </div>

  );

};

export default StatCard;