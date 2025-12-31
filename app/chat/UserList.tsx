"use client";

import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket-client";
import { useRouter } from "next/navigation";
import UserModal from "@/components/UserModal";
import { useProfileModal } from "@/contexts/ProfileModalContext";
import { useParams } from "next/navigation";

type UserType = {
  _id: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
};

export default function UserList() {
  const router = useRouter();
  const socket = getSocket();
  const params = useParams();

  const { showSelfProfile, setShowSelfProfile } = useProfileModal();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  const [me, setMe] = useState(null);

  useEffect(() => {
    if (!params?.userId) {
      setActiveChatUserId(null);
    }
  }, [params]);


  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setMe(data));
  }, []);


  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      });
  }, []);

  // REALTIME ONLINE STATUS
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
    <>
      <div className="w-1/3 overflow-y-auto bg-green-800 h-full">
        <h2 className="p-4 text-xl font-semibold text-green-100">Users</h2>

        {loading && <p className="p-4">Loading...</p>}

        {users.map((u) => (
          <div
            key={u._id}
            className={`group flex items-center gap-3 p-2 cursor-pointer ${activeChatUserId === u._id
                ? "bg-green-50"
                : "hover:bg-gray-200"}`}
          >

            {/* Avatar → open modal */}
            <img
              src={u.avatar || "/avatar.png"}
              className="w-12 h-12 rounded-full border"
              onClick={async (e) => {
                e.stopPropagation();
                const res = await fetch(`/api/users/${u._id}`);
                const fullUser = await res.json();
                fullUser._id = fullUser._id || fullUser.id;
                setSelectedUser(fullUser);
              }}
            />

            {/* Username → open chat */}
            <div
              className={`flex-1 ${activeChatUserId === u._id
                  ? "text-green-800 font-bold"
                  : "text-green-100 group-hover:text-green-800"}`}
              onClick={() => {
                setActiveChatUserId(u._id);   // highlight row
                router.push(`/chat/${u._id}`); // open chat
              }}
            >
              {u.username}
            </div>


            {/* Online dot */}
            <span
              className={`w-3 h-3 rounded-full ${u.isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
            ></span>
          </div>
        ))}
      </div>


      {/* SELF PROFILE MODAL */}
      {showSelfProfile && me && (
        <UserModal
          user={me}              // <-- Self profile uses logged-in user
          isSelf={true}
          onClose={() => setShowSelfProfile(false)}
          onAvatarChange={() => { }}
        />
      )}

      {/* OTHER USER PROFILE MODAL */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          isSelf={false}
          onClose={() => setSelectedUser(null)}
          onAvatarChange={(newUrl) => {
            setUsers(prev =>
              prev.map(u =>
                u._id === selectedUser._id ? { ...u, avatar: newUrl } : u
              )
            );
          }}
        />
      )}
    </>
  );
}
