import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_WS_URL || "wss://localhost:8081";

const socket = ({ token }: { token: string }) => {
  return io(API_URL + "?token=" + token);
};

export default socket;
