import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          avatar: user.avatar,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.avatar = token.avatar;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
