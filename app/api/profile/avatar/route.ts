import { NextResponse } from "next/server";
import cookie from "cookie";
import { verifyJWT } from "@/lib/jwt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { handleUpload } from "@/lib/upload-handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const decoded: any = verifyJWT(cookies.token);

    if (!decoded?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    // upload to /public/uploads/avatars
    const url = await handleUpload(req, "avatars");

    if (!url) {
      return NextResponse.json({ error: "Upload failed" }, { status: 400 });
    }

    await User.updateOne({ _id: decoded.id }, { avatar: url });

    return NextResponse.json({ success: true, avatar: url });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
