import {
  Target,
  ShieldAlert,
  BadgeDollarSign
} from "lucide-react";

const Card = ({
  title,
  value,
  icon,
  color,
  bg
}) => {

  return (

    <div className={`
      rounded-3xl
      p-7
      border
      backdrop-blur-xl
      shadow-2xl
      ${bg}
    `}>

      <div className="
        flex
        items-center
        gap-4
        mb-5
      ">

        {icon}

        <h2 className="
          text-xl
          font-bold
          text-white
        ">

          {title}

        </h2>

      </div>

      <h3 className={`
        text-5xl
        font-black
        ${color}
      `}>

        ${value}

      </h3>

    </div>

  );

};

const AITradeLevels = ({
  recommendedEntry,
  recommendedStopLoss,
  recommendedTakeProfit
}) => {

  return (

    <div className="
      grid
      grid-cols-1
      xl:grid-cols-3
      gap-6
    ">

      <Card
        title="Recommended Entry"
        value={recommendedEntry || 0}
        color="text-emerald-400"
        bg="
          bg-emerald-500/10
          border-emerald-400/20
        "
        icon={
          <BadgeDollarSign className="text-emerald-400" />
        }
      />

      <Card
        title="Stop Loss"
        value={recommendedStopLoss || 0}
        color="text-red-400"
        bg="
          bg-red-500/10
          border-red-400/20
        "
        icon={
          <ShieldAlert className="text-red-400" />
        }
      />

      <Card
        title="Take Profit"
        value={recommendedTakeProfit || 0}
        color="text-cyan-400"
        bg="
          bg-cyan-500/10
          border-cyan-400/20
        "
        icon={
          <Target className="text-cyan-400" />
        }
      />

    </div>

  );

};

export default AITradeLevels;