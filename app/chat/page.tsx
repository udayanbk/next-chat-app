"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket-client";

export default function ChatWindow() {
  const { userId } = useParams();
  const socket = getSocket();

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // LOAD HISTORY WHEN USERID CHANGES
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/messages/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      });
  }, [userId]);

  // LISTEN FOR NEW INCOMING MESSAGES
  useEffect(() => {
    const handler = (msg: any) => {
      if (
        msg.sender === userId ||
        msg.receiver === userId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("private-message", handler);
    return () => socket.off("private-message", handler);
  }, [socket, userId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("private-message", {
      to: userId,
      text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          Chat
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded w-fit ${
              m.sender === userId ? "bg-gray-200" : "bg-blue-200 ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
