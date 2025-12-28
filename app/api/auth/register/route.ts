import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/utils";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const user = await User.create({
      username: body.username,
      email: body.email,
      phone: body.phone,
      password: await hashPassword(body.password),
    });

    return NextResponse.json({ success: true, id: user._id });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
