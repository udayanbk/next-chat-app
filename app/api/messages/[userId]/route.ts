export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Message } from "@/models/Message";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDB();

    // --- FIX: Await params ---
    const { userId: otherUserId } = await params;

    // Get token from cookie
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return NextResponse.json([]);

    const decoded: any = verifyJWT(token);
    if (!decoded?.id) return NextResponse.json([]);

    const currentUserId = decoded.id;

    // Fetch chat history
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(messages);
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return NextResponse.json([]);
  }
}
