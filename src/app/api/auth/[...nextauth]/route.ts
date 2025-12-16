export const dynamic = "force-dynamic";

import { compare } from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";              // central role enum (see below)

/* ---------- NextAuth configuration ---------- */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,            // always set one in prod

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,                    // 30 days
    updateAge: 12 * 60 * 60,                      // refresh every 12 h if active
  },

  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        /* ---- basic payload guard ---- */
        if (!creds?.email || !creds.password) {
          throw new Error("Both email and password are required");
        }

        /* ---- fetch user ---- */
        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user) throw new Error("No account found for that e‑mail");

        /* ---- optional: enforce verified flag ---- */
        // if (!user.emailVerified) {
        //   throw new Error("Please verify your e‑mail before signing in");
        // }

        /* ---- check password ---- */
        const valid = await compare(creds.password, user.password);
        if (!valid) throw new Error("Incorrect password");

        /* ---- success: return minimal user object ---- */
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };
      },
    }),
  ],

  pages: {
    signIn : "/login",
    error  : "/login?error=true",   // surface credential errors
    verifyRequest: "/verify-email",
  },

  callbacks: {
    /* ---------- JWT ---------- */
    async jwt({ token, user }) {
      if (user) {
        token.id   = (user as any).id;
        token.role = (user as any).role;
        token.createdAt = (user as any).createdAt;
      }
      return token;
    },

    /* ---------- Session ---------- */
    async session({ session, token }) {
      if (token?.id) {
        (session.user as any).id   = token.id;
        (session.user as any).role = token.role;
        (session.user as any).createdAt = token.createdAt;
      }
      return session;
    },

    /* ---------- (optional) redirect guard ---------- */
    async redirect({ url, baseUrl }) {
      // Always allow same‑origin URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Disallow external redirects
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      console.log(
        `[AUTH] ${user.email} signed in ${isNewUser ? "(new user)" : ""}`
      );
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
