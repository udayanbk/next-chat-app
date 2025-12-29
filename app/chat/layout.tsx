"use client";

import UserList from "./UserList"; // <-- server component
import { getSocket } from "@/lib/socket-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserModal from "@/components/UserModal";

export default function ChatLayout({ children }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);

  // You can still track online/offline through socket
  // If needed, later we will add real-time badges

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <h2 className="p-4 text-xl font-semibold border-b">Users</h2>

        {/* FAST server-loaded list */}
        <UserList />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1">{children}</div>

      {/* Profile Modal */}
      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
