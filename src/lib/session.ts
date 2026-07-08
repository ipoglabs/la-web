import type { AuthUser } from "@/types/auth";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

/** Derive up-to-2-char initials from a display name (mirrors la-avatar.tsx) */
function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns the authenticated user from the real session (JWT `session` cookie,
 * verified + looked up via getCurrentUser()), mapped to the shape AppHeader /
 * AvatarDropdown expect. Returns null if not logged in.
 *
 * This function is safe to call from Server Components and layouts.
 */
export async function getSession(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const displayName = user.fullName || user.username || "Member";

  return {
    id: user.id,
    name: displayName,
    initials: getInitials(displayName) || "?",
    avatarUrl: user.image || undefined,
    role: user.role === "admin" ? "admin" : "member",
    status: "online",
  };
}