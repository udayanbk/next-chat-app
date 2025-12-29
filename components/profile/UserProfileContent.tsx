"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfileContent({ userId }: { userId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"info" | "photos" | "chat">("info");

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      {/* Close Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center space-y-2">
        <Image
          src={`/api/profile/avatar/${userId}`}
          width={110}
          height={110}
          className="rounded-full border"
          alt="avatar"
          unoptimized
        />
        <h2 className="text-2xl font-semibold">User Profile</h2>
      </div>

      {/* Tabs */}
      <div className="flex justify-around mt-6 border-b pb-2 text-sm">
        <button
          onClick={() => setTab("info")}
          className={tab === "info" ? "font-bold text-blue-600" : "text-gray-500"}
        >
          Profile Info
        </button>
        <button
          onClick={() => setTab("photos")}
          className={tab === "photos" ? "font-bold text-blue-600" : "text-gray-500"}
        >
          Photos
        </button>
        <button
          onClick={() => setTab("chat")}
          className={tab === "chat" ? "font-bold text-blue-600" : "text-gray-500"}
        >
          Chat
        </button>
      </div>

      {/* Content Areas */}
      <div className="mt-4">

        {/* Profile Info Tab */}
        {tab === "info" && (
          <div className="space-y-3 text-center">
            <p className="text-gray-700">Basic profile information will appear here.</p>

            <button
              onClick={() => router.push(`/chat/chatbox/${userId}`)}
              className="bg-blue-600 text-white w-full py-2 rounded mt-4"
            >
              Send Message
            </button>
          </div>
        )}

        {/* Photos Tab */}
        {tab === "photos" && (
          <div className="grid grid-cols-3 gap-2">
            {/* This will load user photos from your API */}
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-gray-200 rounded" />
            ))}
          </div>
        )}

        {/* Chat Quick Option */}
        {tab === "chat" && (
          <div className="text-center space-y-4">
            <p className="text-gray-700">Start chatting with this user.</p>
            <button
              onClick={() => router.push(`/chat/chatbox/${userId}`)}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Open Chat Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
