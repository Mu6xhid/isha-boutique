"use client";

export function LogoutButton() {
  async function handleLogout() {
    // call our API route → clears the cookie, then redirect
    await fetch("/api/logout", { method: "GET" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
