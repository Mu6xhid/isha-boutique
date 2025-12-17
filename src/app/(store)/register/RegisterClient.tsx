"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();

  /* form state */
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  /* ---------- submit (typed) ---------- */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>      // ✅ event type
  ) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    router.push("/login");
  };

  /* ---------- jsx ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 space-y-4 border rounded"
    >
      <h2 className="text-xl font-bold">Register</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        required
        value={form.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, name: e.target.value })
        }
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, email: e.target.value })
        }
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, password: e.target.value })
        }
        className="w-full px-3 py-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-neutral-800"
      >
        Register
      </button>
    </form>
  );
}
