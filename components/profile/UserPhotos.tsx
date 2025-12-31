"use client";

import { useEffect, useState } from "react";

export default function UserPhotos({ userId }: { userId: string }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/photos/${userId}`)
      .then(res => res.json())
      .then(data => {
        setPhotos(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p className="p-4">Loading photos...</p>;

  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {photos.map((p) => (
        <img
          key={p._id}
          src={p.url}
          className="w-full h-24 object-cover rounded-md"
        />
      ))}

      {photos.length === 0 && (
        <p className="text-center text-gray-400 col-span-3">No photos yet</p>
      )}
    </div>
  );
}
