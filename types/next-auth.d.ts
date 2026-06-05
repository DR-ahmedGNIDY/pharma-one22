import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  // Shape returned by the `authorize` callback.
  // `id` and `role` are picked up by the `jwt` callback as `user.role`.
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // `sub` (built-in) carries the user id.
    // We only need to augment the role field.
    role?: string;
  }
}
