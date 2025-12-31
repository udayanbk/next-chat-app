import Image from "next/image";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export default async function UserProfileContent({ userId }) {
  await connectDB();
  const user = await User.findById(userId).lean();

  if (!user) return <div>User not found</div>;

  return (
    <div className="text-center space-y-3">
      <Image
        src={user.avatar || "/avatar.png"}
        width={100}
        height={100}
        alt="avatar"
        className="rounded-full mx-auto"
      />

      <h2 className="text-xl font-semibold">{user.username}</h2>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-500">
        Member since {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
