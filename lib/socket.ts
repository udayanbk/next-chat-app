// lib/socket.ts

import { Server } from "socket.io";
import cookie from "cookie";
import { verifyJWT } from "@/lib/jwt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Message } from "@/models/Message";

let io: Server | null = null;

export function initSocket(server: any) {
  if (io) return io; // Prevent duplicate initialization

  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: "http://localhost:3000",
      credentials: true, // 🔥 required for cookies
    },
  });

  io.on("connection", async (socket) => {
    try {
      // -----------------------------
      // AUTHENTICATION VIA COOKIE JWT
      // -----------------------------
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      const decoded: any = verifyJWT(token);
      if (!decoded?.id) {
        console.log("❌ Invalid token, disconnecting socket");
        socket.disconnect();
        return;
      }

      const userId = decoded.id;
      socket.userId = userId;

      await connectDB();

      // -----------------------------
      // JOIN USER'S PRIVATE ROOM
      // -----------------------------
      socket.join(userId);

      // -----------------------------
      // MARK USER ONLINE
      // -----------------------------
      await User.updateOne({ _id: userId }, { isOnline: true });
      io.emit("user-online", userId);

      // -----------------------------
      // HANDLE PRIVATE MESSAGE
      // -----------------------------
      socket.on("private-message", async ({ to, text }) => {
        if (!to || !text) return;

        await connectDB();

        const msg = await Message.create({
          sender: userId,
          receiver: to,
          text,
        });

        // send to receiver only through their room
        io.to(to).emit("private-message", msg);

        // send back to sender also
        socket.emit("private-message", msg);
      });

      // -----------------------------
      // HANDLE DISCONNECT
      // -----------------------------
      socket.on("disconnect", async () => {
        await User.updateOne({ _id: userId }, { isOnline: false });
        io.emit("user-offline", userId);
      });

    } catch (err) {
      console.error("SOCKET SERVER ERROR:", err);
      socket.disconnect();
    }
  });

  return io;
}
