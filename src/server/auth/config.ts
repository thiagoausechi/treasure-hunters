import bcrypt from "bcrypt";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { adminUsers } from "../db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.name, credentials.name as string),
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );

        if (isPasswordCorrect) return { id: user.id, name: user.name };

        return null;
      },
    }),
  ],

  /*
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  */

  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;

      return token;
    },

    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
      },
    }),
  },
} satisfies NextAuthConfig;
