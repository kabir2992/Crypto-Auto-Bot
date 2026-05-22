import {
  Search,
  ArrowUpDown
} from "lucide-react";

const TradeFilter = ({
  filter,
  setFilter,
  search,
  setSearch
}) => {

  return (

    <div className="
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-5
      mb-8
    ">

      {/* SEARCH */}

      <div className="
        relative
        w-full
        lg:max-w-md
      ">

        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
          size={20}
        />

        <input
          type="text"
          placeholder="Search trade..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/5
            py-4
            pl-12
            pr-5
            text-white
            outline-none
            transition-all
            duration-300
            focus:border-cyan-400
            focus:bg-white/10
          "
        />

      </div>

      {/* FILTER BUTTONS */}

      <div className="
        flex
        flex-wrap
        items-center
        gap-3
      ">

        {
          [
            "ALL",
            "BUY",
            "SELL"
          ].map((type) => (

            <button
              key={type}
              onClick={() =>
                setFilter(type)
              }
              className={`
                rounded-2xl
                px-5
                py-3
                text-sm
                font-bold
                transition-all
                duration-300
                border

                ${
                  filter === type
                    ? `
                      border-cyan-400
                      bg-cyan-500/20
                      text-cyan-300
                    `
                    : `
                      border-white/10
                      bg-white/5
                      text-slate-300
                      hover:bg-white/10
                    `
                }
              `}
            >

              <div className="
                flex
                items-center
                gap-2
              ">

                <ArrowUpDown size={16} />

                {type}

              </div>

            </button>

          ))
        }

      </div>

    </div>

  );

};

export default TradeFilter;