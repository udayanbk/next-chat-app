import { NextResponse } from "next/server";
import cookie from "cookie";
import { verifyJWT } from "@/lib/jwt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    if (!token) {
      return NextResponse.json(null);
    }

    const decoded: any = verifyJWT(token);
    if (!decoded?.id) return NextResponse.json(null);

    await connectDB();

    const user = await User.findById(decoded.id).lean();

    if (!user) return NextResponse.json(null);

    // Normalize format for frontend
    return NextResponse.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      photos: user.photos || [],
      isOnline: user.isOnline,
      createdAt: user.createdAt,
    });

  } catch (err) {
    console.error("ME ERROR:", err);
    return NextResponse.json(null);
  }
}
