// src/types/next-auth.d.ts
export {}; // 👈 REQUIRED to treat this as a module

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      createdAt: string; // ✅ added
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    createdAt: string; // ✅ added
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    createdAt: string; // ✅ added
  }
}
