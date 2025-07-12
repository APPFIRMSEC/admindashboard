import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  // Use Vercel's environment variables for dynamic URLs
  ...(process.env.VERCEL_URL && {
    url: `https://${process.env.VERCEL_URL}`,
  }),
  // Fallback for local development
  ...(process.env.NODE_ENV === "development" && {
    url: "http://localhost:3000",
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Auth: Starting authorization for:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Auth: Missing credentials");
          return null;
        }

        try {
          console.log("🔍 Auth: Looking up user in database...");

          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          console.log("👤 Auth: User found:", user ? "Yes" : "No");

          if (!user) {
            console.log("❌ Auth: User not found");
            return null;
          }

          console.log("🔐 Auth: Checking password...");

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("🔐 Auth: Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("❌ Auth: Invalid password");
            return null;
          }

          const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar === null ? undefined : user.avatar,
          };

          console.log("✅ Auth: Authorization successful for:", userData.email);
          return userData;
        } catch (error) {
          console.error("💥 Auth: Database error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
};
