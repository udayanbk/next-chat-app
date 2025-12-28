import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function up() {
  await connectDB();
  await User.collection.createIndex({ username: 1 }, { unique: true });
}

export async function down() {}
