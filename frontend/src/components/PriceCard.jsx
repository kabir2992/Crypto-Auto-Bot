const PriceCard = ({ livePrice }) => {

    const formattedLivePrice =
        Number(livePrice) > 0
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(livePrice)
            : "$0.00";

    return (

        <div className="
      bg-gradient-to-r
      from-yellow-400
      to-orange-500
      p-6
      rounded-3xl
      shadow-2xl
      mb-8
      text-black
      relative
      overflow-hidden
    ">

            <div className="
        absolute
        top-0
        right-0
        w-40
        h-40
        bg-white/20
        rounded-full
        blur-3xl
      " />

            <h2 className="
        text-xl
        font-semibold
        mb-2
      ">

                Live SOLUSDT Price

            </h2>

            <p className="
        text-6xl
        font-bold
      ">

                {formattedLivePrice}

            </p>

        </div>

    );

};

export default PriceCard;
