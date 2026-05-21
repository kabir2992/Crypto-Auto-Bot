import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_LIVE_SOCKET_API_URL ||
    "http://localhost:5000",
  {
    transports: ["websocket"]
  }
);

export default socket;
