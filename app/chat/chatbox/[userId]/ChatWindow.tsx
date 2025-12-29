"use client";

import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket-client";

export default function ChatWindow({ userId, initialMessages }) {
  const socket = getSocket();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState(initialMessages || []);
  const [text, setText] = useState("");

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: any) => {
      if (msg.sender === userId || msg.receiver === userId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    socket.on("private-message", handler);
    return () => socket.off("private-message", handler);
  }, [socket, userId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("private-message", { to: userId, text });

    // optimistic UI
    setMessages((prev) => [...prev, { text, sender: "me" }]);
    scrollToBottom();

    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
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

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
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
