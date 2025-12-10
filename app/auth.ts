import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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
        return { id: user.id, email: user.email, name: user.username } as any;
      },
    }),
  ],
  callbacks: {
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
