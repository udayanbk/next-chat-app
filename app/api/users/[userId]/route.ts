import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function GET(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  await connectDB();

  const user = await User.findById(userId).lean();

  if (!user) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(user, { status: 200 });
}
