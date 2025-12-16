"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();

  /* form state */
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  /* -------- handle submit (typed) -------- */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>   // ✅ event type
  ) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/"); // to homepage (or /admin/products etc.)
  };

  /* -------- jsx -------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 space-y-4 border rounded"
    >
      <h2 className="text-xl font-bold">Login</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, email: e.target.value })
        }
        className="w-full px-3 py-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, password: e.target.value })
        }
        className="w-full px-3 py-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-neutral-800"
      >
        Login
      </button>
    </form>
  );
}
