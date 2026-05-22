import {
  useState
} from "react";

import {
  X,
  Wallet
} from "lucide-react";

const AddFundsModal = ({
  open,
  onClose,
  onAddFunds
}) => {

  const [amount, setAmount] =
    useState("");

  if (!open)
  {
    return null;
  }

  const handleSubmit = () => {

    const parsed =
      Number(amount);

    if (!parsed || parsed <= 0)
    {
      return;
    }

    onAddFunds(parsed);

    setAmount("");

    onClose();

  };

  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-md
      p-4
    ">

      <div className="
        relative
        w-full
        max-w-lg
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#07111F]
        p-8
        shadow-[0_0_80px_rgba(0,0,0,0.6)]
      ">

        <button
          onClick={onClose}
          className="
            absolute
            top-5
            right-5
            text-slate-400
            hover:text-white
            transition
          "
        >

          <X size={24} />

        </button>

        <div className="
          flex
          items-center
          gap-4
          mb-8
        ">

          <div className="
            w-16
            h-16
            rounded-2xl
            bg-cyan-500/20
            flex
            items-center
            justify-center
          ">

            <Wallet
              size={32}
              className="
                text-cyan-400
              "
            />

          </div>

          <div>

            <h2 className="
              text-3xl
              font-black
              text-white
            ">

              Add Trading Funds

            </h2>

            <p className="
              text-slate-400
              mt-1
            ">

              Increase balance for trading operations

            </p>

          </div>

        </div>

        <div className="
          mb-8
        ">

          <label className="
            block
            text-slate-300
            mb-3
            font-semibold
          ">

            Amount (USD)

          </label>

          <input
            type="number"
            placeholder="Enter amount..."
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-5
              py-4
              text-white
              outline-none
              transition
              focus:border-cyan-400
            "
          />

        </div>

        <button
          onClick={handleSubmit}
          className="
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            py-4
            text-lg
            font-bold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
          "
        >

          Add Funds

        </button>

      </div>

    </div>

  );

};

export default AddFundsModal;