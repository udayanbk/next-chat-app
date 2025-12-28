"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserModal({ user, onClose }) {
  const router = useRouter();
  if (!user) return null;

  // CLOSE when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}   // 🔥 close on outside click
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <Image
            src={user.avatar || "/avatar.png"}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full border shadow"
          />
        </div>

        {/* Name */}
        <h2 className="text-xl font-semibold text-center">{user.username}</h2>

        {/* Status */}
        <p className="text-center text-gray-600 text-sm mt-1">
          {user.isOnline ? (
            <span className="text-green-600 font-medium">● Online</span>
          ) : (
            <span className="text-gray-400">● Offline</span>
          )}
        </p>

        {/* Contact Info */}
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Email:</strong> {user.email || "Not Provided"}</p>
          <p><strong>Phone:</strong> {user.phone || "Not Provided"}</p>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Require Permission to Chat */}
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => alert("Permission request sent (future logic).")}
          >
            Request Permission
          </button>

          {/* Start Chat */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              onClose();
              router.push(`/chat/${user._id}`);
            }}
          >
            Start Chat
          </button>

          {/* Block User */}
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => alert("User Blocked (future logic).")}
          >
            Block User
          </button>

          {/* See All Photos */}
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            onClick={() => alert("Open Photos Gallery (to be implemented).")}
          >
            See All Photos
          </button>
        </div>
      </div>
    </div>
  );
}
