"use client";

import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <>
      {users.map((u) => (
        <div
          key={u._id}
          className="flex items-center gap-3 p-3 hover:bg-gray-200 border-b"
        >
          {/* Avatar → modal or profile */}
          <Link href={`/chat/${u._id}`} prefetch={false}>
            <Image
              src={u.avatar || "/avatar.png"}
              width={40}
              height={40}
              alt="avatar"
              className="rounded-full border cursor-pointer"
            />
          </Link>

          {/* Username → open chat */}
          <Link href={`/chat/${u._id}`} className="flex-1">
            {u.username}
          </Link>

          {/* Online dot — optional (server doesn't track online state) */}
          <span className="w-3 h-3 bg-gray-400 rounded-full" />
        </div>
      ))}
    </>
  );
}
