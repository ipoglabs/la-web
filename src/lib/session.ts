import type { AuthUser } from "@/types/auth";

/**
 * Returns the authenticated user from the session, or null if not logged in.
 *
 * Swap this stub for your real auth provider when ready:
 *   - NextAuth v5: replace with `auth()` from `@/auth`
 *   - Lucia / better-auth: call their session validation here
 *
 * This function is safe to call from Server Components and layouts.
 */
export async function getSession(): Promise<AuthUser | null> {
  // TODO: Wire up real auth (NextAuth, Lucia, better-auth, etc.)
  return null;
}
