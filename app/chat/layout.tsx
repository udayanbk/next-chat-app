"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSocket } from "@/lib/socket-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type UserType = {
  _id: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
};

export default function ChatLayout({
  children,
  modal,        // ✅ DO NOT rename this!
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const socket = getSocket();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("user-online", (id: string) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isOnline: true } : u))
      );
    });

    socket.on("user-offline", (id: string) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isOnline: false } : u))
      );
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [socket]);

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      
      {/* 🔥 correct modal slot */}
      {modal}

      <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
        <h2 className="p-4 text-xl font-semibold border-b">Users</h2>

        {loading && <p className="p-4">Loading...</p>}

        {users.map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-3 p-3 hover:bg-gray-200 border-b cursor-pointer"
          >
            <Link href={`/chat/(.)profile/${u._id}`} prefetch={false}>
              <Image
                src={u.avatar || "/avatar.png"}
                width={40}
                height={40}
                className="rounded-full cursor-pointer hover:opacity-80"
                alt="avatar"
              />
            </Link>

            <div
              className="flex-1"
              onClick={() => router.push(`/chat/chatbox/${u._id}`)}
            >
              {u.username}
            </div>

            <span
              className={`w-3 h-3 rounded-full ${
                u.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
        ))}
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
