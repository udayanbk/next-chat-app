"use client";

import { useState } from "react";

export default function EditProfileForm({ user, onClose }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);

    const form = new FormData();
    form.append("username", username);
    form.append("email", email);

    if (avatarFile) {
      form.append("avatar", avatarFile);
    }

    const res = await fetch("/api/profile/update", {
      method: "POST",
      body: form,
    });

    setSaving(false);

    if (res.ok) {
      alert("Profile updated successfully!");
      onClose();
    } else {
      alert("Failed to update");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>

      <div>
        <label className="block text-sm text-gray-600">Username</label>
        <input
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Email</label>
        <input
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Change Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={saveProfile}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
