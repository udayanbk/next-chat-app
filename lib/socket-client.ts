import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:3000", {
      path: "/socket.io",
      withCredentials: true,   // 🔥 MUST
      transports: ["websocket"]
    });
  }
  return socket;
}
