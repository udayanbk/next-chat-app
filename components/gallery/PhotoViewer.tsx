"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function PhotoViewer({
  photos,
  startIndex,
  onClose,
  reloadUser,
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);

  const current = photos[index];

  // Keyboard shortcuts
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [index]);

  const next = () => {
    setIndex((i) => (i + 1) % photos.length);
    setZoom(1);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
    setZoom(1);
  };

  const setAsAvatar = async () => {
    const res = await fetch("/api/profile/avatar/set-from-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: current }),
    });

    if (!res.ok) {
      toast.error("Failed to set avatar");
      return;
    }

    toast.success("Avatar updated!");
    await reloadUser();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button className="absolute top-5 right-5 text-white" onClick={onClose}>
        <X size={32} />
      </button>

      {/* Prev */}
      <button
        className="absolute left-5 text-white"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
      >
        <ChevronLeft size={48} />
      </button>

      {/* Next */}
      <button
        className="absolute right-5 text-white"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
      >
        <ChevronRight size={48} />
      </button>

      {/* Image */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Image
          src={current}
          width={900}
          height={900}
          alt=""
          className="rounded-lg shadow-xl transition-transform"
          style={{ transform: `scale(${zoom})` }}
        />

        {/* Zoom Controls */}
        <div className="flex justify-center mt-4 gap-4">
          <button
            className="text-white text-xl bg-white/10 px-4 py-1 rounded"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
          >
            +
          </button>
          <button
            className="text-white text-xl bg-white/10 px-4 py-1 rounded"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
          >
            -
          </button>
        </div>

        {/* Set As Avatar Button */}
        <button
          onClick={setAsAvatar}
          className="absolute bottom-5 right-1/2 translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
        >
          <UserCheck size={18} />
          Set as Avatar
        </button>
      </div>
    </div>
  );
}
