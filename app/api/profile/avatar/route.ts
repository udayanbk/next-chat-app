import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const form = await req.formData();
    const file = form.get("avatar") as File;
    const userId = form.get("userId") as string;

    if (!file || !userId)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `avatars/${userId}-${Date.now()}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const avatarUrl = `${process.env.AWS_S3_BASE_URL}/${key}`;

    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    return NextResponse.json({ success: true, avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Avatar upload failed" }, { status: 500 });
  }
}
