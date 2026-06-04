const SectionTitle = ({
  title,
  subtitle,
  rightContent
}) => {

  return (

    <div className="
      mb-8
      flex
      flex-col
      gap-4
      lg:flex-row
      lg:items-center
      lg:justify-between
    ">

      <div>

        <h2 className="
          text-3xl
          md:text-4xl
          font-black
          text-white
        ">

          {title}

        </h2>

        {
          subtitle && (

            <p className="
              mt-2
              text-slate-400
            ">

              {subtitle}

            </p>

          )
        }

      </div>

      {
        rightContent && (

          <div>

            {rightContent}

          </div>

        )
      }

    </div>

  );

};

export default SectionTitle;