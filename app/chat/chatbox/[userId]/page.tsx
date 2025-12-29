import connectDB from "@/lib/db";
import { Message } from "@/models/Message";
import ChatWindow from "./ChatWindow";

export default async function ChatPage({ params }) {
  const { userId } = await params; // ensure awaited

  await connectDB();

  const messages = await Message.find({
    $or: [
      { sender: userId },
      { receiver: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return (
    <ChatWindow userId={userId} initialMessages={JSON.parse(JSON.stringify(messages))} />
  );
}
