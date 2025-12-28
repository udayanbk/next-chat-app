export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json([], { status: 200 });
    }

    const decoded: any = verifyJWT(token);

    if (!decoded?.id) {
      return NextResponse.json([], { status: 200 });
    }

    const users = await User.find(
      { _id: { $ne: decoded.id } },
      { username: 1, email: 1, avatar: 1 }
    ).lean();

    return NextResponse.json(users);
  } catch (err) {
    console.error("USER LIST ERROR:", err);
    return NextResponse.json([], { status: 200 });
  }
}
