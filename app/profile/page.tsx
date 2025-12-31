"use client";

import { useEffect, useState } from "react";
import UserModal from "@/components/UserModal";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <UserModal user={user} isSelf={true} onClose={() => {}} />
  );
}
