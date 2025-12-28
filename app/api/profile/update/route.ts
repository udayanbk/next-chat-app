import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";
import cookie from "cookie";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const token = cookies.token;
    const decoded: any = verifyJWT(token);
    if (!decoded?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();

    const updateData: any = {};
    if (form.get("username")) updateData.username = form.get("username");
    if (form.get("email")) updateData.email = form.get("email");
    if (form.get("phone")) updateData.phone = form.get("phone");

    await connectDB();

    await User.updateOne({ _id: decoded.id }, updateData);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
