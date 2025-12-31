import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Photo } from "@/models/Photo";

export async function GET(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  if (!userId || userId === "undefined") {
    return NextResponse.json([], { status: 200 });
  }

  await connectDB();

  const photos = await Photo.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(photos);
}
