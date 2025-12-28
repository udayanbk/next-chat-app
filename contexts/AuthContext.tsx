"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false); // track first load
  const [loadingUser, setLoadingUser] = useState(true);

  const reloadUser = async () => {
    setLoadingUser(true);
    const res = await fetch("/api/auth/me", {
      cache: "no-store"
    });
    const data = await res.json();
    setUser(data);
    setLoaded(true);
    setLoadingUser(false);
  };

useEffect(() => {
  if (!loaded) reloadUser(); // run only first time
}, [loaded]);

  return (
    <AuthContext.Provider value={{ user, setUser, reloadUser, loaded, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
