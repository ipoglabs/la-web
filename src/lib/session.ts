import { cookies } from "next/headers";
import type { AuthUser } from "@/types/auth";
import { verifyToken } from "@/lib/auth";
import { isSessionRevoked } from "@/lib/userSession";
import { isAdminEmail } from "@/lib/admin";
import dbConnect from "@/lib/db";
import User from "@/models/user";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns the authenticated user from the real session cookie, or null
 * if not logged in. Safe to call from Server Components and root layouts.
 *
 * Named distinctly from lib/auth.ts's `getSession()` (which returns the raw
 * re-verified JWT payload, `SessionPayload`) — this one always hits the DB
 * for fresh display fields (name/avatar/role), returning the UI-ready
 * `AuthUser` shape instead.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("session")?.value || cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const userId = payload.userId || payload.id;
  if (!userId) return null;

  await dbConnect();

  if (await isSessionRevoked(payload.sid, userId)) return null;

  const user: any = await User.findById(userId)
    .select("fullName image email isDeleted isSuspended accountStatus")
    .lean();

  if (
    !user ||
    user.isDeleted === true ||
    user.isSuspended === true ||
    user.accountStatus === "Suspended" ||
    user.accountStatus === "Deleted"
  ) {
    return null;
  }

  const name = user.fullName || "Member";

  return {
    id: String(user._id),
    name,
    initials: getInitials(name),
    avatarUrl: user.image || undefined,
    role: isAdminEmail(user.email) ? "admin" : "member",
    status: "online",
  } satisfies AuthUser;
}