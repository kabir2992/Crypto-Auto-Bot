const TradeTable = ({ trades }) => {
  const tradeList =
    Array.isArray(trades) ? trades : [];

  return (

    <div className="
      bg-white/5
      backdrop-blur-lg
      border border-white/10
      rounded-3xl
      p-6
      shadow-2xl
    ">

      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">

        Trade History

      </h2>

      <div className="
        overflow-x-auto
      ">

        <table className="
          w-full
        ">

          <thead>

            <tr className="
              border-b
              border-white/10
            ">

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Profit
              </th>

              <th className="p-4 text-left">
                Time
              </th>

            </tr>

          </thead>

          <tbody>

            {tradeList.map((trade) => (

              <tr
                key={trade._id}
                className="
                  border-b
                  border-white/5
                  hover:bg-white/5
                  transition-all
                "
              >

                <td className="
                  p-4
                  font-bold
                ">

                  <span className={
                    trade.side === "BUY"
                      ? "text-green-400"
                      : "text-red-400"
                  }>

                    {trade.side}

                  </span>

                </td>

                <td className="p-4">
                  ${trade.price || 0}
                </td>

                <td className="p-4">
                  {trade.quantity || 0}
                </td>

                <td className="p-4">
                  ${trade.profit || 0}
                </td>

                <td className="p-4">

                  {
                    new Date(
                      trade.createdAt
                    ).toLocaleString()
                  }

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default TradeTable;
