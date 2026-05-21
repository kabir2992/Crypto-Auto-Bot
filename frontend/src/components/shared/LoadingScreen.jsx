import React from "react";

const LoadingScreen = () => {

  return (

    <div className="
      min-h-screen
      flex items-center justify-center
      bg-[#050816]
    ">

      <div className="text-center">

        <div className="
          h-16 w-16
          border-4
          border-cyan-400
          border-t-transparent
          rounded-full
          animate-spin
          mx-auto mb-6
        " />

        <h1 className="
          text-white
          text-2xl
          font-bold
        ">
          Loading Trading Terminal...
        </h1>

      </div>

    </div>

  );

};

export default LoadingScreen;