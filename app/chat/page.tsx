import Image from "next/image";

export default function ChatWindow() {

  return (
    <div className="relative w-full h-full">
    <Image
      src="/chat_home.png"
      alt="Chat Banner"
      fill
    />
  </div>
  );
}
