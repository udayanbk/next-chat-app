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

export default function Header() {
  const { user, loaded, reloadUser } = useAuth();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await reloadUser();
    window.location.href = "/login";
  };

  return (
    <header className="w-full h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm">
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatar || "/avatar.png"} />
              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 mr-4">

            <div className="px-3 py-2 text-sm font-medium">
              {user.username}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/chat" className="flex items-center gap-2">
                <Home size={16} />
                Home
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User size={16} />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 cursor-pointer flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
