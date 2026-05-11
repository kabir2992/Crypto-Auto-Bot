const BotStatus = ({
  botMode
}) => {

  const getColor = () => {

    switch (botMode) {

      case "ANALYZING":
        return "bg-yellow-500";

      case "BUYING":
        return "bg-green-500";

      case "SELLING":
        return "bg-red-500";

      case "HOLDING":
        return "bg-blue-500";

      default:
        return "bg-gray-500";

    }

  };

  return (

    <div className="
      flex
      items-center
      gap-3
      mb-8
    ">

      <div className={`
        w-4
        h-4
        rounded-full
        animate-pulse
        ${getColor()}
      `} />

      <p className="
        text-xl
        font-semibold
      ">

        Bot Mode:
        <span className="
          ml-2
          text-blue-400
        ">

          {botMode}

        </span>

      </p>

    </div>

  );

};

export default BotStatus;