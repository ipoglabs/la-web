"use server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import { requireAdminId } from "@/lib/requireAdmin";

/**
 * Permanent delete — real admin session required (moved out of dev-tools,
 * which only sat behind shared proxy.ts Basic Auth; a destructive,
 * irreversible action belongs behind the real per-admin gate instead).
 *
 * Unlike the real account-deletion flow (softDeleteAccount in
 * profile/deleteAccount.ts), this actually removes the document from Mongo
 * rather than flagging isDeleted — that's the whole point here: email and
 * primaryNumber both carry unique indexes, so a soft-deleted row would still
 * block re-registering with the same identifier during manual testing.
 * Deliberately kept separate from softDeleteAccount — not merged into one
 * "delete" path.
 */
export async function hardDeleteUser(id: string): Promise<{ success: boolean; message?: string }> {
  const adminId = await requireAdminId();
  if (!adminId) return { success: false, message: "Forbidden." };

  if (!id) return { success: false, message: "Missing user id." };

  await dbConnect();

  const result = await User.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return { success: false, message: "User not found." };
  }
  return { success: true };
}
