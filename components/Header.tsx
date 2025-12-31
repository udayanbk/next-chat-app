"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { User, Settings, LogOut, Home } from "lucide-react";
import { useProfileModal } from "../contexts/ProfileModalContext";

export default function Header() {
  const { user, loaded, reloadUser } = useAuth();
  const { setShowSelfProfile } = useProfileModal();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await reloadUser();
    window.location.href = "/login";
  };

  return (
    <header className="w-full h-16 border-b-3 border-b-green-800 bg-green-100 flex items-center px-6 justify-between shadow-sm">
      <Link href="/chat" className="font-bold text-xl">
        <span className="text-blue-600">MyChat</span> App
      </Link>

      {!loaded ? (
        <div className="text-gray-500">Loading...</div>
      ) : !user ? (
        <div className="flex gap-4">
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <h1 className="text-lg font-semibold text-green-800">{user.username}</h1>
          <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatar || "/avatar.png"} />
              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-40 mr-4 bg-green-100 -translate-x-7">

            {/* <div className="px-3 py-2 text-sm font-medium">
              {user.username}
            </div>

            <DropdownMenuSeparator /> */}

            <DropdownMenuItem asChild>
              <Link href="/chat" className="flex items-center gap-2 hover:bg-green-200">
                <Home size={16} />
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowSelfProfile(true)}
              className="flex items-center gap-2 cursor-pointer hover:bg-green-200"
            >
              <User size={16} />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 cursor-pointer flex items-center gap-2 hover:bg-green-200"
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        
      )}
    </header>
  );
}
