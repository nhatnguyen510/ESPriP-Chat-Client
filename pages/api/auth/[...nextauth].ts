import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";
import { login } from "@/../lib/api/auth";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as any;

        try {
          const res = await login(username, password);

          return res;
        } catch (err) {
          console.log("Error: ", err);
          throw new Error(JSON.stringify(err));
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (
        trigger === "update" &&
        session.access_token &&
        session.refresh_token
      ) {
        console.log("Session: ", session);

        return {
          ...token,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        };
      }

      if (user) {
        return { ...token, ...user };
      }

      return token;
    },
    async session({ token, session, trigger }) {
      session.user = token as any;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(nextAuthOptions);
