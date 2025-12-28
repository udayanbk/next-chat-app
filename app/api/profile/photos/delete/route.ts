import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyJWT } from "@/lib/jwt";
import cookie from "cookie";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const token = cookies.token;
    const decoded: any = verifyJWT(token);
    if (!decoded?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { url } = body;

    if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

    await connectDB();

    await User.updateOne(
      { _id: decoded.id },
      { $pull: { photos: url } }
    );

    // delete from disk
    const filePath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Photo delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
