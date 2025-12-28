"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { reloadUser } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   // ✅ FIX ADDED

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");       // now works
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    setLoading(false);

    // 👇 SAFE JSON PARSE (prevents Unexpected end of JSON input)
    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = { error: "Unexpected server response" };
    }

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    else {
      await reloadUser();   // Update user BEFORE redirect
      router.push("/chat");
      return;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-600 mb-3 text-center">{error}</p>
        )}

        <input
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
