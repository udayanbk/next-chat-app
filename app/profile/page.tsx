"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import { toast } from "sonner";
import PhotoViewer from "@/components/gallery/PhotoViewer";

import {
  updateProfileAction,
  uploadAvatarAction,
  uploadPhotoAction,
  deletePhotoAction,
  setAvatarFromPhotoAction,
} from "./actions";

export default function ProfilePage() {
  const { user, reloadUser } = useAuth();

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (i: number) => {
    setViewerIndex(i);
    setViewerOpen(true);
  };

  // Simulate upload progress
  const simulateProgress = () => {
    setUploadProgress(10);
    const int = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(int);
          return 100;
        }
        return p + Math.random() * 25;
      });
    }, 200);
  };

  useEffect(() => {
    if (uploadProgress === 100) {
      setTimeout(() => setUploadProgress(0), 700);
    }
  }, [uploadProgress]);


  // ---------with Server Actions HANDLERS ---------

  const updateProfileHandler = async (e: any) => {
    e.preventDefault();
    setSavingProfile(true);

    const form = new FormData(e.target);

    try {
      await updateProfileAction(form);
      toast.success("Profile updated!");
      await reloadUser();
    } catch (e: any) {
      toast.error(e.message);
    }

    setSavingProfile(false);
  };

  const uploadAvatarHandler = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const form = new FormData();
    form.append("avatar", file);

    try {
      await uploadAvatarAction(form);
      toast.success("Avatar updated!");
      await reloadUser();
    } catch (error: any) {
      toast.error(error.message);
    }

    setUploadingAvatar(false);
  };

  const uploadPhotoHandler = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const form = new FormData();
    form.append("photo", file);

    try {
      await uploadPhotoAction(form);
      toast.success("Photo uploaded!");
      await reloadUser();
    } catch (error: any) {
      toast.error(error.message);
    }

    setUploadingPhoto(false);
  };

  const deletePhoto = async (url: string) => {
    try {
      await deletePhotoAction(url);
      toast.success("Photo deleted");
      await reloadUser();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const setAsAvatar = async (url: string) => {
    try {
      await setAvatarFromPhotoAction(url);
      toast.success("Avatar updated!");
      await reloadUser();
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  // ---------without Server Actions HANDLERS ---------

  // const uploadAvatarHandler = async (e: any) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setUploadingAvatar(true);
  //   simulateProgress();

  //   const form = new FormData();
  //   form.append("avatar", file);

  //   const res = await fetch("/api/profile/avatar", {
  //     method: "POST",
  //     body: form,
  //   });

  //   setUploadingAvatar(false);

  //   if (!res.ok) return toast.error("Failed to update avatar");

  //   toast.success("Avatar updated!");
  //   await reloadUser();
  // };

  // const setAsAvatar = async (url: string) => {
  //   const res = await fetch("/api/profile/avatar/set-from-photo", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ url }),
  //   });

  //   if (!res.ok) {
  //     toast.error("Failed to set avatar");
  //     return;
  //   }

  //   toast.success("Avatar updated!");
  //   await reloadUser();
  // };

  // const uploadPhotoHandler = async (e: any) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setUploadingPhoto(true);
  //   simulateProgress();

  //   const form = new FormData();
  //   form.append("photo", file);

  //   const res = await fetch("/api/profile/photos/upload", {
  //     method: "POST",
  //     body: form,
  //   });

  //   setUploadingPhoto(false);

  //   if (!res.ok) return toast.error("Upload failed (limit 10?)");

  //   toast.success("Photo uploaded!");
  //   await reloadUser();
  // };

  // const updateProfileHandler = async (e: any) => {
  //   e.preventDefault();
  //   setSavingProfile(true);

  //   const form = new FormData(e.target);

  //   const res = await fetch("/api/profile/update", {
  //     method: "POST",
  //     body: form,
  //   });

  //   setSavingProfile(false);

  //   if (!res.ok) return toast.error("Profile update failed");

  //   toast.success("Profile updated!");
  //   await reloadUser();
  // };

  // const deletePhoto = async (url: string) => {
  //   const res = await fetch("/api/profile/photos/delete", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ url }),
  //   });

  //   if (!res.ok) return toast.error("Failed to delete photo");

  //   toast.success("Photo deleted");
  //   await reloadUser();
  // };

  if (!user)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <>
      {/* ⭐ FULLSCREEN VIEWER */}
      {viewerOpen && (
        <PhotoViewer
          photos={user.photos}
          startIndex={viewerIndex}
          reloadUser={reloadUser}
          onClose={() => setViewerOpen(false)}
        />
      )}

      <div className="p-6 max-w-6xl mx-auto">

        {/* ⭐ Unified Container */}
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-8">

            <h1 className="text-3xl font-extrabold mb-8 text-center">
              Your Profile
            </h1>

            {/* GRID: LEFT PROFILE + RIGHT GALLERY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {/* LEFT SECTION */}
              <div className="md:col-span-1 space-y-6">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-32 h-32 border shadow-md">
                    <AvatarImage src={user.avatar || "/avatar.png"} />
                    <AvatarFallback className="text-3xl">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {uploadingAvatar && (
                    <Progress className="w-40" value={uploadProgress} />
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingAvatar}
                    className="w-52"
                    onChange={uploadAvatarHandler}
                  />
                </div>

                <Separator />

                {/* Display Info */}
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">{user.phone}</p>
                </div>

                <Separator />

                {/* Edit Profile Form */}
                <form className="space-y-4" onSubmit={updateProfileHandler}>
                  <Input name="username" defaultValue={user.username} placeholder="Username" />
                  <Input name="email" defaultValue={user.email} placeholder="Email" />
                  <Input name="phone" defaultValue={user.phone} placeholder="Phone" />

                  <Button className="w-full" disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </form>

                {/* Upload Photo Button */}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-52 mt-3"
                    disabled={uploadingPhoto}
                    onChange={uploadPhotoHandler}
                  />
                </div>

                {uploadingPhoto && (
                  <Progress value={uploadProgress} className="w-full" />
                )}
              </div>

              {/* RIGHT SECTION — Photo Gallery */}
              {/* RIGHT SECTION — Photo Gallery */}
              <div className="md:col-span-2">

                {/* HEADER + UPLOAD BUTTON IN SAME LINE */}
                <div className="flex items-center justify-between mb-4">

                  <h3 className="text-xl font-semibold text-center md:text-left w-full">
                    Your Photos
                  </h3>

                  {/* Upload Photo Button (hidden when 10 photos uploaded) */}
                  {user.photos?.length > 0 && user.photos.length < 10 && (
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="w-52"
                        disabled={uploadingPhoto || user.photos.length >= 10}
                        onChange={uploadPhotoHandler}
                      />
                    </div>
                  )}
                </div>

                {/* ---- NO PHOTOS: Show centered upload box ---- */}
                {user.photos?.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50">
                    <p className="text-gray-500 mb-4">
                      You have no photos yet.
                    </p>

                    <Input
                      type="file"
                      accept="image/*"
                      className="w-64"
                      disabled={uploadingPhoto}
                      onChange={uploadPhotoHandler}
                    />
                  </div>
                )}

                {/* ---- PHOTO GRID ---- */}
                {user.photos?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                    {user.photos.map((img, index) => (
                      <div key={index} className="relative group">

                        <div onClick={() => openViewer(index)}>
                          <Image
                            src={img}
                            width={600}
                            height={600}
                            alt="photo"
                            className="rounded-md object-cover w-full h-36 border cursor-pointer"
                          />
                        </div>

                        {/* Set as Avatar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAsAvatar(img);
                          }}
                          className="absolute bottom-1 left-1/2 -translate-x-1/2
                       bg-blue-600 text-white text-xs px-2 py-1 rounded
                       opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          Set Avatar
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhoto(img);
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white 
                      px-2 py-1 rounded text-xs opacity-0 
                      group-hover:opacity-100 transition shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

}
