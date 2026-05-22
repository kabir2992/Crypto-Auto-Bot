import {
  useEffect,
  useState
} from "react";

import socket from "../services/socket";

const useLivePrice = () => {

  const [livePrice, setLivePrice] =
    useState(0);

  useEffect(() => {

    const handleLivePrice = (data) => {

      if (
        data &&
        typeof data.price === "number"
      ) {

        setLivePrice(data.price);

      }

    };

    socket.on(
      "livePrice",
      handleLivePrice
    );

    return () => {

      socket.off(
        "livePrice",
        handleLivePrice
      );

    };

  }, []);

  return livePrice;

};

export default useLivePrice;