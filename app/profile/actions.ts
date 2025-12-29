"use server";

import path from "path";
import fs from "fs/promises";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

// ---------- AUTH HELPER ----------
async function getUserFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const decoded: any = verifyJWT(token);
  return decoded?.id || null;
}

// ---------- UPDATE PROFILE ----------
export async function updateProfileAction(formData: FormData) {
  const userId = await getUserFromCookie();
  if (!userId) throw new Error("Unauthorized");

  await connectDB();

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  await User.findByIdAndUpdate(userId, {
    username,
    email,
    phone,
  });

  return { success: true };
}

// ---------- UPLOAD AVATAR ----------
export async function uploadAvatarAction(formData: FormData) {
  const userId = await getUserFromCookie();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("avatar") as File;
  if (!file) throw new Error("No file");

  await connectDB();

  // Save file to /public/uploads/avatars
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "-" + Math.floor(Math.random() * 999999) + ".png";
  const filepath = path.join(process.cwd(), "public/uploads/avatars", filename);

  await fs.writeFile(filepath, buffer);

  await User.findByIdAndUpdate(userId, {
    avatar: "/uploads/avatars/" + filename,
  });

  return { success: true };
}

// ---------- UPLOAD PHOTO ----------
export async function uploadPhotoAction(formData: FormData) {
  const userId = await getUserFromCookie();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("photo") as File;
  if (!file) throw new Error("No file");

  await connectDB();

  const user = await User.findById(userId);
  if (user.photos.length >= 10) throw new Error("Max limit reached");

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "-" + Math.floor(Math.random() * 999999) + ".jpg";
  const filepath = path.join(process.cwd(), "public/uploads/photos", filename);

  await fs.writeFile(filepath, buffer);

  user.photos.push("/uploads/photos/" + filename);
  await user.save();

  return { success: true };
}

// ---------- DELETE PHOTO ----------
export async function deletePhotoAction(photoUrl: string) {
  const userId = await getUserFromCookie();
  if (!userId) throw new Error("Unauthorized");

  await connectDB();

  const user = await User.findById(userId);
  user.photos = user.photos.filter((p) => p !== photoUrl);
  await user.save();

  return { success: true };
}

// ---------- SET AVATAR FROM EXISTING PHOTO ----------
export async function setAvatarFromPhotoAction(photoUrl: string) {
  const userId = await getUserFromCookie();
  if (!userId) throw new Error("Unauthorized");

  await connectDB();

  await User.findByIdAndUpdate(userId, {
    avatar: photoUrl,
  });

  return { success: true };
}