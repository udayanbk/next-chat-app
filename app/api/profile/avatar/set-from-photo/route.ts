import { NextResponse } from "next/server";
import cookie from "cookie";
import { verifyJWT } from "@/lib/jwt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const decoded: any = verifyJWT(cookies.token);

    if (!decoded?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await User.updateOne(
      { _id: decoded.id },
      { avatar: url }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SET-AVATAR ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
