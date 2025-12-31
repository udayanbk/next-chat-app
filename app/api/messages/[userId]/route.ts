export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Message } from "@/models/Message";
import { User } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDB();

    // --- FIX: Await params ---
    const { userId: otherUserId } = await params;

    // Extract token
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ messages: [], user: null });
    }

    const decoded: any = verifyJWT(token);
    if (!decoded?.id) {
      return NextResponse.json({ messages: [], user: null });
    }

    const currentUserId = decoded.id;

    // Fetch the OTHER USER details
    const otherUser = await User.findById(otherUserId)
      .select("_id username avatar email")
      .lean();

    // If other user missing
    if (!otherUser) {
      return NextResponse.json({ messages: [], user: null });
    }

    // Fetch message history
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      messages,
      user: otherUser,
    });

  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return NextResponse.json({ messages: [], user: null });
  }
}
