import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Auth.js only infers a trusted host automatically on Vercel. We deploy to
  // Railway, where every /api/auth/* call otherwise fails with
  // `UntrustedHost: Host must be trusted` and sign-in returns a 500.
  // Kept in code rather than an AUTH_TRUST_HOST env var so it survives the
  // service being recreated.
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
          banned: user.banned,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role ?? "member";
        token.banned = user.banned ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        // Snapshot from sign-in time. Routes that grant or deny anything
        // re-read the user row via getCurrentUser(); this is for rendering.
        session.user.role = (token.role as Role | undefined) ?? "member";
        session.user.banned = (token.banned as boolean | undefined) ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
