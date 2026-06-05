import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email    = credentials?.email    as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // ── Hardcoded admin account ─────────────────────────────────────────
        // Kept so the admin can always log in even when the DB is unreachable.
        if (email === "admin@pharmaone.com" && password === "123456") {
          return {
            id:    "admin-hardcoded",
            name:  "Admin",
            email: "admin@pharmaone.com",
            role:  "admin",
          };
        }

        // ── MongoDB user lookup ─────────────────────────────────────────────
        // Allows users who registered via /api/auth/register to log in.
        try {
          await dbConnect();

          const user = await UserModel.findOne({ email });
          if (!user) return null;

          const isPasswordValid = await user.comparePassword(password);
          if (!isPasswordValid) return null;

          return {
            id:    user._id.toString(),
            name:  user.name,
            email: user.email,
            image: user.image ?? undefined,
            role:  user.role,   // "user" | "admin" from MongoDB
          };
        } catch {
          // DB unreachable — fail gracefully without crashing the auth flow
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * Called on sign-in (user is defined) and on every subsequent request
     * (user is undefined; existing token fields are preserved by NextAuth).
     *
     * token.sub is automatically set to user.id by NextAuth — we only need
     * to write role explicitly.
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;   // typed via next-auth.d.ts — no cast needed
      }
      return token;
    },

    /**
     * Called whenever auth() / getServerSession() is used.
     * Copies JWT fields onto the session object that reaches client components.
     *
     * token.sub  → session.user.id   (built-in NextAuth field, typed string|undefined)
     * token.role → session.user.role (our custom field, typed via next-auth.d.ts)
     */
    async session({ session, token }) {
      if (session.user) {
        // token.sub is string | undefined; only assign when present
        if (token.sub) session.user.id = token.sub;
        // token.role augmentation may surface as unknown in strict mode —
        // we know exactly what we wrote in the jwt callback, so the cast is safe.
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
