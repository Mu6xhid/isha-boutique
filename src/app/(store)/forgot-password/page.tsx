"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  async function handleClick() {
    await fetch("/api/forgot-password", { method: "POST" });
    setSent(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="space-y-4 max-w-sm w-full text-center">
        <h1 className="text-xl font-bold">Forgot password</h1>
        {sent ? (
          <p className="text-green-600">Reset link was sent to your email.</p>
        ) : (
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Send reset link
          </button>
        )}
      </div>
    </main>
  );
}
