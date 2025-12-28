"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSocket } from "@/lib/socket-client";
import UserModal from "@/components/UserModal";
import { useRouter } from "next/navigation";

type UserType = {
  _id: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const socket = getSocket();     // <-- FIX HERE

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
  }, [socket]);  // <-- FIX

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* LEFT SIDE USERS LIST */}
      <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
        <h2 className="p-4 text-xl font-semibold border-b">Users</h2>

        {loading && <p className="p-4">Loading...</p>}

        {users.map((u) => (
          // <Link
          //   key={u._id}
          //   href={`/chat/${u._id}`}
          //   className="flex items-center gap-3 p-3 hover:bg-gray-200 border-b"
          // >
          //   <img
          //     src={u.avatar || "/avatar.png"}
          //     className="w-10 h-10 rounded-full border"
          //   />
          //   <span>{u.username}</span>

          //   <span
          //     className={`ml-auto w-3 h-3 rounded-full ${
          //       u.isOnline ? "bg-green-500" : "bg-gray-400"
          //     }`}
          //   ></span>
          // </Link>
          <div
            key={u._id}
            className="flex items-center gap-3 p-3 hover:bg-gray-200 border-b cursor-pointer"
          >
            {/* Avatar — click → open modal */}
            <img
              src={u.avatar || "/avatar.png"}
              className="w-10 h-10 rounded-full border"
              onClick={(e) => {
                e.stopPropagation();     // IMPORTANT → do NOT open chat!!
                setSelectedUser(u);
              }}
            />

            {/* Name & chat trigger */}
            <div
              onClick={() => router.push(`/chat/${u._id}`)}
              className="flex-1"
            >
              <span>{u.username}</span>
            </div>

            {/* Online dot */}
            <span
              className={`w-3 h-3 rounded-full ${u.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
            ></span>
          </div>

        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1">{children}</div>
      <UserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

    </div>
  );
}
