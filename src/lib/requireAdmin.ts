import { getSession } from "@/lib/session";

/** Shared guard for every admin-only server action — returns the acting
 * admin's user id, or null if the caller isn't signed in as the admin
 * account (see lib/admin.ts for how that's determined). */
export async function requireAdminId(): Promise<string | null> {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session.id;
}
