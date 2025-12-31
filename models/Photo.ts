import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export const Photo = mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);
