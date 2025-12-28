import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "/avatar.jpeg",
    },
    photos: {
      type: [String],
      default: [],
    },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
