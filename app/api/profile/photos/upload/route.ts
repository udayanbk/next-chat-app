import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import connectDB from "@/lib/db";
import { Photo } from "@/models/Photo";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const form = await req.formData();
    const file = form.get("file") as File;
    const userId = form.get("userId") as string;

    if (!file || !userId)
      return NextResponse.json({ error: "Missing file/userId" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `photos/${userId}/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const fileUrl = `${process.env.AWS_S3_BASE_URL}/${key}`;

    // Save DB
    await Photo.create({ userId, url: fileUrl });
    await User.findByIdAndUpdate(userId, { $push: { photos: fileUrl } });

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


//---------------------upload in public folder (old)---------------------
// import { NextResponse } from "next/server";
// import cookie from "cookie";
// import { verifyJWT } from "@/lib/jwt";
// import connectDB from "@/lib/db";
// import { User } from "@/models/User";
// import { handleUpload } from "@/lib/upload-handler";
// export const runtime = "nodejs";
// export async function POST(req: Request) {
//   try {
//     const cookies = cookie.parse(req.headers.get("cookie") || "");
//     const decoded: any = verifyJWT(cookies.token);

//     if (!decoded?.id)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     await connectDB();

//     const user = await User.findById(decoded.id);

//     if (user.photos.length >= 10) {
//       return NextResponse.json(
//         { error: "Photo limit reached (max 10)" },
//         { status: 400 }
//       );
//     }

//     const url = await handleUpload(req, "photos");

//     if (!url) {
//       return NextResponse.json({ error: "Upload failed" }, { status: 400 });
//     }

//     await User.updateOne({ _id: decoded.id }, { $push: { photos: url } });

//     return NextResponse.json({ success: true, url });
//   } catch (err) {
//     console.error("Photo upload error:", err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
