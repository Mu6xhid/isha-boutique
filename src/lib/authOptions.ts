// src/lib/authOptions.ts
import { NextAuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;

        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) return null;

        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;

        // must include id
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],

  pages: { signIn: '/login' },

  callbacks: {
    // expose role in the JWT and session
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (token) (session.user as any).role = token.role;
      return session;
    },
  },
};

/** Small helper so other files can simply `await auth()` */
export function auth() {
  return getServerSession(authOptions);
}
