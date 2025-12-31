import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/lib/db";
import { Photo } from "@/models/Photo";
import { User } from "@/models/User";
import { s3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const { url, userId } = await req.json();

    if (!url || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Extract S3 Key from URL
    const key = url.split(".com/")[1];

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );

    // Remove from DB
    await Photo.deleteOne({ url });
    await User.findByIdAndUpdate(userId, { $pull: { photos: url } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
//---------------------delete from public folder (old)---------------------
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { verifyJWT } from "@/lib/jwt";
// import cookie from "cookie";
// import connectDB from "@/lib/db";
// import { User } from "@/models/User";

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const cookies = cookie.parse(req.headers.get("cookie") || "");
//     const token = cookies.token;
//     const decoded: any = verifyJWT(token);
//     if (!decoded?.id)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { url } = body;

//     if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

//     await connectDB();

//     await User.updateOne(
//       { _id: decoded.id },
//       { $pull: { photos: url } }
//     );

//     // delete from disk
//     const filePath = path.join(process.cwd(), "public", url);
//     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Photo delete error:", err);
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }
