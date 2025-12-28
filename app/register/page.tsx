"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" }); // clear field error on change
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    const data = await res.json();

    if (!res.ok) {
      // If API returns field-level errors
      if (data.errors) {
        setFieldErrors(data.errors);
      } else if (data.error) {
        // fallback top-level error
        setFieldErrors({ username: data.error });
      }
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="input"
        />
        {fieldErrors.username && (
          <p className="text-red-500 text-sm mb-2">{fieldErrors.username}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mb-2">{fieldErrors.email}</p>
        )}

        <input
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
          className="input"
        />
        {fieldErrors.phone && (
          <p className="text-red-500 text-sm mb-2">{fieldErrors.phone}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input"
        />
        {fieldErrors.password && (
          <p className="text-red-500 text-sm mb-2">{fieldErrors.password}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
