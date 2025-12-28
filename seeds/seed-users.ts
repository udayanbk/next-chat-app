import "dotenv/config";

import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

(async () => {
  await connectDB();

  await User.create({
    username: "admin",
    password: await hashPassword("admin123"),
  });

  console.log("Seed done");
  process.exit(0);
})();
