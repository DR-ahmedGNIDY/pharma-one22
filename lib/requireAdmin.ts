import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Server-side admin guard for API route handlers.
 *
 * Usage — call at the top of any POST / PUT / DELETE handler:
 *
 *   const authError = await requireAdmin();
 *   if (authError) return authError;
 *
 * Returns a NextResponse (401 or 403) when access is denied,
 * or null when the caller is a verified admin and may proceed.
 *
 * Role propagation chain:
 *   authorize() → { role } → jwt({ token, user }) → token.role
 *   → session({ session, token }) → session.user.role
 *   → auth() here reads session.user.role
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "يجب تسجيل الدخول أولاً" },
      { status: 401 }
    );
  }

  // session.user.role is typed as string | undefined via next-auth.d.ts —
  // no type cast needed.
  if (session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "غير مصرح لك بالوصول" },
      { status: 403 }
    );
  }

  return null; // authorised — caller may proceed
}
