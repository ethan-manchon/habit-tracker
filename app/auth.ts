import {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_SECRET_ID ||
  !process.env.NEXTAUTH_SECRET
) {
  console.warn("Auth env variables (GOOGLE_CLIENT_ID, GOOGLE_SECRET_ID, NEXTAUTH_SECRET) are not all set. Auth providers may not work until they are configured.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        // no email verification required (accounts are auto-validated)
        return { id: user.id, email: user.email, name: user.name } as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          // If provider reports email verified, mark user as verified in DB
          // profile shape depends on provider; check common fields
          // @ts-ignore
          const emailVerified = (profile && (profile.email_verified || profile.emailVerified)) ?? false;
          if (emailVerified) {
            await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
          }
        }
      } catch (err) {
        // ignore errors here
      }
      return true;
    },
    async jwt({ token, user }) {
      // on initial sign in, persist user id on the token
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        // prefer values from 'user' when available (database strategy)
        session.user.id = (user as any)?.id ?? (token as any)?.id ?? session.user.id;
        session.user.email = (user as any)?.email ?? session.user.email;
        session.user.name = (user as any)?.name ?? session.user.name;
      }
      return session;
    },
  },
};
