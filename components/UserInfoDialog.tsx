"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function UserInfoDialog({ user, open, onClose }) {
  const router = useRouter();
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>User Info</DialogTitle>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar || "/avatar.png"} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <h2 className="text-xl text-center font-semibold">{user.username}</h2>
        <p className="text-center text-gray-600">
          {user.isOnline ? "🟢 Online" : "⚪ Offline"}
        </p>

        <Separator className="my-4" />

        <div className="text-sm space-y-1">
          <p><strong>Email:</strong> {user.email || "Not provided"}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
        </div>

        <DialogFooter className="mt-4 grid grid-cols-2 gap-3">

          <Button
            variant="secondary"
            onClick={() => alert("Permission request sent!")}
          >
            Request Permission
          </Button>

          <Button
            onClick={() => {
              onClose();
              router.push(`/chat/${user._id}`);
            }}
          >
            Start Chat
          </Button>

          <Button
            variant="destructive"
            onClick={() => alert("User blocked!")}
          >
            Block User
          </Button>

          <Button
            variant="outline"
            onClick={() => alert("Photo gallery coming next...")}
          >
            See Photos
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
