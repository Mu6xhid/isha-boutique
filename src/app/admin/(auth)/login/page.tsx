"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      ...form,
      redirect: false,   // prevent NextAuth from auto‑redirecting
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    // success  →  admin dashboard
    router.replace("/admin/products");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-24 max-w-sm space-y-4 border p-6 shadow"
    >
      <h1 className="text-2xl font-bold text-center">Admin Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="password"
        required
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="submit"
        className="w-full rounded bg-black py-2 text-white hover:bg-neutral-800"
      >
        Log in
      </button>
    </form>
  );
}
