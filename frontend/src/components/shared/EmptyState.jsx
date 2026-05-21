import React from "react";

const EmptyState = ({ title, subtitle }) => {

  return (

    <div className="
      bg-white/5
      border border-white/10
      rounded-3xl
      p-10
      text-center
      backdrop-blur-xl
    ">

      <h2 className="
        text-2xl
        font-bold
        text-white
        mb-3
      ">
        {title}
      </h2>

      <p className="
        text-gray-400
      ">
        {subtitle}
      </p>

    </div>

  );

};

export default EmptyState;