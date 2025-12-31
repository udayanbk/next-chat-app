import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { userId, username, email, phone } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { username, email, phone },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
