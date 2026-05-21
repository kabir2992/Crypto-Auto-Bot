import { FaRobot } from "react-icons/fa";

const Header = () => {

  return (

    <div className="
      flex
      justify-between
      items-center
      mb-8
    ">

      <div className="
        flex
        items-center
        gap-4
      ">

        <div className="
          bg-blue-500
          p-4
          rounded-2xl
          shadow-lg
          shadow-blue-500/50
        ">

          <FaRobot size={28} />

        </div>

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">

            Crypto Auto Bot

          </h1>

          <p className="
            text-gray-400
            mt-1
          ">

            AI Powered Trading System

          </p>

        </div>

      </div>

    </div>

  );

};

export default Header;