"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import type { Session } from "next-auth";

/** Wraps children in `<SessionProvider>` so client components can use `useSession()` */
export default function SessionClient({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
