import type { AdminRole } from "./adminAuth";

export const ROLE_PERMS: Record<AdminRole, string[]> = {
  super_admin: [
    "admin.create",
    "admin.update",
    "admin.suspend",
    "admin.hold",
    "admin.delete",
    "user.*",
    "post.*",
    "comm.*",
    "analytics.view",
  ],

  admin: [
    "user.review",
    "user.update",
    "user.suspend",
    "user.hold",
    "user.delete",

    "moderator.create",
    "moderator.update",
    "moderator.suspend",
    "moderator.hold",

    "post.review",
    "post.approve",
    "post.suspend",
    "post.hold",
    "post.report",
    "post.delete",

    "comm.user",
  ],

  moderator: [
    "post.review",
    "post.approve",
    "post.suspend",
    "post.hold",
    "post.report",

    "user.suspend",
    "user.report",
    "comm.user",
  ],

  support: ["comm.user"],

  analyst: ["analytics.view", "comm.view"],
};

export function hasPerm(role: AdminRole, perm: string) {
  const perms = ROLE_PERMS[role] || [];
  if (perms.includes("user.*") && perm.startsWith("user.")) return true;
  if (perms.includes("post.*") && perm.startsWith("post.")) return true;
  if (perms.includes("comm.*") && perm.startsWith("comm.")) return true;
  return perms.includes(perm);
}
