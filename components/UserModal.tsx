"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserModal({
  user,
  isSelf = false,
  onClose,
  onAvatarChange
}: {
  user: any;
  onClose: () => void;
  onAvatarChange: (url: string) => void;
}) {
  const router = useRouter();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Self profile inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Init self fields
  useEffect(() => {
    if (isSelf && user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user, isSelf]);

  // Load photos
  useEffect(() => {
    if (!user) return;

    const loadPhotos = async () => {
      setLoading(true);

      try {
        const uid = user._id || user.id;
        if (!uid) return;

        const res = await fetch(`/api/profile/photos/${uid}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setPhotos(data || []);
      } catch (e) {
        console.error("PHOTO LOAD ERROR:", e);
      }

      setLoading(false);
    };

    loadPhotos();
  }, [user]);

  const updateProfile = async () => {
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id || user._id,
        username,
        email,
        phone,
      }),
    });

    if (!res.ok) {
      alert("Failed to update.");
      return;
    }

    alert("Profile updated!");
  };

  const handleUpload = async (e: any) => {
    console.log("Current user inside modal:", user);
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("userId", user._id || user.id);

    const res = await fetch("/api/profile/photos/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (data.success) {
      setPhotos(prev => [...prev, { url: data.url }]);
    }
  };


  const deletePhoto = async (url: string) => {
    const res = await fetch("/api/profile/photos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, userId: user.id || user._id }),
    });

    const data = await res.json();
    if (data.success) {
      setPhotos(prev => prev.filter(p => p.url !== url));
    }
  };


  const setAsAvatar = async (url: string) => {
    const res = await fetch("/api/profile/avatar/set-from-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, userId: user.id || user._id }),
    });

    const data = await res.json();
    if (data.success) {
      // 🔥 UPDATE USER OBJECT LOCALLY
      user.avatar = url;

      // 🔥 FORCE RE-RENDER BY SETTING PHOTOS AGAIN
      setPhotos((prev) => [...prev]);
      if (onAvatarChange) onAvatarChange(url);

      alert("Avatar updated!");
    }
  };



  const handleClose = () => {
    if (typeof onClose === "function") onClose();

    if (window.location.pathname === "/profile") {
      router.push("/chat");
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl max-w-5xl w-[95%] h-[75%] flex overflow-hidden relative"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* X CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>

          {/* LEFT SIDE PROFILE */}
          <div className="w-1/3 bg-gray-100 p-6 border-r overflow-y-auto">
            <div className="flex flex-col items-center">
              <Image
                src={user.avatar || "/avatar.png"}
                width={120}
                height={120}
                className="rounded-full shadow"
                alt="avatar"
              />
            </div>

            <div className="mt-6 space-y-4">
              {console.log("isSelf:", user)}
              {/* VIEWING OTHER USER → READ ONLY */}
              {!isSelf && (
                <>
                  <div className="text-center">
                    {console.log("Rendering read-only fields")}
                    <label className="text-sm">Username</label>
                    <p className="text-xl font-bold">{user.username || "N/A"}</p>
                  </div>

                  <div className="text-center">
                    <label className="text-sm">Email</label>
                    <p className="text-xl font-bold">{user.email || "N/A"}</p>
                  </div>

                  <div className="text-center">
                    <label className="text-sm">Mobile</label>
                    <p className="text-xl font-bold">
                      {user.phone || "N/A"}
                    </p>
                  </div>
                </>
              )}

              {/* VIEWING SELF → EDITABLE */}
              {isSelf && (
                <>
                  <div>
                    {console.log("Rendering editable fields")}
                    <label className="text-sm font-semibold">Username</label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border bg-white p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border bg-white p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Mobile</label>
                    <input
                      value={phone}
                      onChange={(e) => set(e.target.value)}
                      className="border bg-white p-2 rounded w-full"
                    />
                  </div>

                  <button className="bg-blue-600 text-white py-2 px-4 rounded w-full mt-4"
                    onClick={updateProfile}
                  >
                    Update Profile
                  </button>
                </>
              )}
            </div>
          </div>


          {/* RIGHT SIDE PHOTOS */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Photos</h3>

              {isSelf && (
                <>
                  <input
                    type="file"
                    id="photoUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                  />

                  <label
                    htmlFor="photoUpload"
                    className="bg-purple-600 text-white px-4 py-2 mt-6 rounded cursor-pointer"
                  >
                    Upload Photos
                  </label>
                </>
              )}

            </div>

            {/* LOADING */}
            {loading && <p className="text-gray-500">Loading...</p>}

            {/* EMPTY */}
            {!loading && photos.length === 0 && (
              <p className="text-gray-500">No photos uploaded.</p>
            )}

            {/* PHOTOS GRID */}
            <div className="grid grid-cols-3 gap-4">
              {photos.map((p, i) => (
                <div key={i} className="relative group">

                  {/* PHOTO */}
                  <Image
                    src={p.url}
                    width={250}
                    height={250}
                    className="rounded-lg object-cover w-full h-[220px]"
                    alt="photo"
                  />

                  {/* DELETE BUTTON — only for self */}
                  {isSelf && (
                    <button
                      onClick={() => deletePhoto(p.url)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      title="Delete Photo"
                    >
                      ✕
                    </button>
                  )}

                  {/* SET AS AVATAR BUTTON — only for self */}
                  {isSelf && (
                    <button
                      onClick={() => setAsAvatar(p.url)}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Set as Avatar
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
