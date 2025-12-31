"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/lib/socket-client";
import { Send } from "lucide-react";

export default function ChatWindow() {
  const { userId } = useParams();
  const socket = getSocket(); // <-- use shared socket

  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // Load chat history
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/messages/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded messages:", data);
        if (data?.user) {
          setMessages(data.messages)
          setUsername(data.user.username || "Unknown User");
        }
        // if (Array.isArray(data.messages)) setMessages(data.messages);
      });
  }, [userId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handler = (msg: any) => {
      if (
        msg.sender === userId ||
        msg.receiver === userId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("private-message", handler);

    return () => {
      socket.off("private-message", handler);
    };
  }, [socket, userId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("private-message", {
      to: userId,
      text,
    });

    setText("");
  };

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();

    const diff =
      (today.setHours(0, 0, 0, 0) -
        new Date(date.setHours(0, 0, 0, 0)).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }


  return (
    <div className="bg-green-100 flex flex-col h-[calc(100vh-7rem)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-green-800">Chat {username}</h2>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-2 bg-green-50">
        {messages.map((msg, i) => {
          const isMe = msg.sender !== userId;

          // Check for date change
          const prevMsg = messages[i - 1];
          const currentDate = new Date(msg.createdAt).toDateString();
          const prevDate = prevMsg
            ? new Date(prevMsg.createdAt).toDateString()
            : null;

          const showDateSeparator = currentDate !== prevDate;

          return (
            <div key={msg._id}>

              {/* DATE SEPARATOR */}
              {showDateSeparator && (
                <div className="flex justify-center my-3">
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* CHAT BUBBLE */}
              <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative max-w-xs p-3 rounded-lg mb-1 ${isMe
                    ? "bg-green-800 text-white rounded-br-none"
                    : "bg-green-100 text-black border border-green-800 rounded-tl-none"
                    }`}
                >
                  {/* Message Text */}
                  <div>{msg.text}</div>

                  {/* Timestamp */}
                  <div className="text-[10px] opacity-70 text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* NOTCH / TAIL */}
                  {isMe ? (
                    // RIGHT SIDE TAIL (SEND)
                    <div
                      className="absolute right-0 bottom-1 translate-x-1 w-0 h-0
      border-t-[10px] border-t-green-800 
      border-l-[10px] border-l-transparent
      rotate-45"
                    ></div>
                  ) : (
                    // LEFT SIDE TAIL (RECEIVED)
                    <div className="absolute left-[-10px] top-0">
                      <div
                        className="absolute w-0 h-0
           border-t-[10px] border-t-transparent
           border-b-[10px] border-b-transparent
           border-r-[10px] border-r-green-800">
                      </div>
                      <div
                        className="absolute left-[2px] top-[2px] w-0 h-0
           border-t-[8px] border-t-transparent
           border-b-[8px] border-b-transparent
           border-r-[8px] border-r-green-100">
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-green-100">
        <div className="relative flex items-center">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 border-4 border-green-800 p-3 pr-12 rounded-full focus:outline-none"
            placeholder="Type a message..."
          />

          {/* SEND ICON BUTTON */}
          <button
            onClick={sendMessage}
            className="rotate-35 absolute right-3 text-blue-600 hover:text-blue-800 mr-2"
          >
            <Send
              size={30}
              className="hover:scale-105 transition-transform"
            />
          </button>

        </div>
      </div>

    </div>
  );
}
