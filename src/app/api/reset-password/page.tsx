"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) router.push("/login?reset=1");
    else setError((await res.json()).error || "Error");
  }

  if (!token) return <p className="text-center p-8">Invalid link.</p>;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
        <h1 className="text-xl font-bold">Set new password</h1>
        {error && <p className="text-red-600">{error}</p>}

        <input
          name="password"
          type="password"
          placeholder="New password"
          required
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update password
        </button>
      </form>
    </main>
  );
}
