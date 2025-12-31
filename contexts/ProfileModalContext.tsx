"use client";

import { createContext, useContext, useState } from "react";

const ProfileModalContext = createContext(null);

export function ProfileModalProvider({ children }) {
  const [showSelfProfile, setShowSelfProfile] = useState(false);

  return (
    <ProfileModalContext.Provider value={{ showSelfProfile, setShowSelfProfile }}>
      {children}
    </ProfileModalContext.Provider>
  );
}

export function useProfileModal() {
  return useContext(ProfileModalContext);
}
