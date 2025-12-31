import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { url, userId } = await req.json();

    if (!url || !userId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();
    await User.findByIdAndUpdate(userId, { avatar: url });

    return NextResponse.json({ success: true, avatar: url });
  } catch (err) {
    console.error("SET AVATAR ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
