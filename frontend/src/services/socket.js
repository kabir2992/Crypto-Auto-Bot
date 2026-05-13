import { io } from "socket.io-client";

const socket = io(
  // "http://56.228.15.68:5000"
  "http://localhost:5000"
);

export default socket;