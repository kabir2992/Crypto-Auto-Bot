const StatCard = ({ title, value, color }) => {

  return (

    <div className={`
      bg-white/5
      backdrop-blur-lg
      border border-white/10
      rounded-3xl
      p-6
      shadow-xl
      hover:scale-105
      transition-all
      duration-300
    `}>

      <p className="
        text-gray-400
        mb-3
      ">

        {title}

      </p>

      <h2 className={`
        text-4xl
        font-bold
        ${color}
      `}>

        {value}

      </h2>

    </div>

  );

};

export default StatCard;