"use client";

import UserList from "./UserList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <UserList />
      <div className="flex-1">{children}</div>
    </div>
  );
}
