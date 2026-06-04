import {
  DatabaseZap
} from "lucide-react";

const EmptyState = ({
  title = "No Data Found",
  description = "Nothing available at the moment."
}) => {

  return (

    <div className="
      flex
      flex-col
      items-center
      justify-center
      rounded-3xl
      border
      border-dashed
      border-white/10
      bg-white/[0.03]
      p-10
      text-center
    ">

      <div className="
        mb-5
        flex
        h-20
        w-20
        items-center
        justify-center
        rounded-full
        bg-cyan-500/10
      ">

        <DatabaseZap
          size={36}
          className="
            text-cyan-400
          "
        />

      </div>

      <h2 className="
        text-2xl
        font-black
        text-white
        mb-2
      ">

        {title}

      </h2>

      <p className="
        max-w-md
        text-slate-400
        leading-7
      ">

        {description}

      </p>

    </div>

  );

};

export default EmptyState;