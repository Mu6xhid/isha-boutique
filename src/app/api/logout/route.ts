import { NextResponse } from "next/server";

/**
 * Clears the session cookie and redirects to /login
 */
export async function GET() {
  const res = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL));

  // overwrite / expire session cookie
  res.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
