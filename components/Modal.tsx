"use client";

import { useRouter } from "next/navigation";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose();
    else router.back();   // default: close modal by going back
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
