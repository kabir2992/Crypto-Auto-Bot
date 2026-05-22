import {
  useMemo,
  useState
} from "react";

import TradeCard from "./TradeCard";
import TradeFilter from "./TradeFilters";

const TradeTable = ({
  trades = []
}) => {

  const [filter, setFilter] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  const filteredTrades =
    useMemo(() => {

      return trades.filter((trade) => {

        const matchesFilter =
          filter === "ALL"
            ? true
            : trade.side === filter;

        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          trade.symbol
            .toLowerCase()
            .includes(searchValue)
          ||
          trade.side
            .toLowerCase()
            .includes(searchValue)
          ||
          trade.status
            .toLowerCase()
            .includes(searchValue);

        return (
          matchesFilter &&
          matchesSearch
        );

      });

    }, [
      trades,
      filter,
      search
    ]);

  return (

    <div className="
      rounded-[2rem]
      border
      border-white/10
      bg-[#07111F]/80
      backdrop-blur-2xl
      p-6
      shadow-[0_0_60px_rgba(0,0,0,0.5)]
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        mb-8
      ">

        <div>

          <h2 className="
            text-4xl
            font-black
            text-white
          ">

            Trade History

          </h2>

          <p className="
            mt-2
            text-slate-400
          ">

            Real-time completed BUY & SELL trades

          </p>

        </div>

        <div className="
          rounded-2xl
          border
          border-cyan-500/20
          bg-cyan-500/10
          px-5
          py-3
          text-cyan-300
          font-bold
        ">

          {filteredTrades.length} Trades

        </div>

      </div>

      {/* FILTER */}

      <TradeFilter
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* GRID */}

      {
        filteredTrades.length > 0
          ? (

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              2xl:grid-cols-3
              gap-6
            ">

              {
                filteredTrades.map((trade) => (

                  <TradeCard
                    key={trade._id}
                    trade={trade}
                  />

                ))
              }

            </div>

          )
          : (

            <div className="
              flex
              flex-col
              items-center
              justify-center
              py-24
              text-center
            ">

              <h3 className="
                text-3xl
                font-black
                text-white
                mb-3
              ">

                No Trades Found

              </h3>

              <p className="
                text-slate-400
                max-w-md
              ">

                No trades matched your current filter or search query.

              </p>

            </div>

          )
      }

    </div>

  );

};

export default TradeTable;