/**
 * This layout is used ONLY for `/admin/login`
 * (it lives in the (auth) route‑group so it never conflicts
 *  with the protected admin layout).
 *
 * It must be a *Client Component* because it wraps the page
 * in <SessionProvider>, allowing `useSession()` inside the
 * login form if you ever need it.
 */
"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider /* <- no props needed here */>
      {children}
    </SessionProvider>
  );
}
