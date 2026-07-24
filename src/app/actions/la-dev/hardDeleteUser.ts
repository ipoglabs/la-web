"use server";

import dbConnect from "@/lib/db";
import User from "@/models/user";

/**
 * Permanent delete — Basic-Auth gated, see src/app/la-dev/page.tsx.
 *
 * Unlike the real account-deletion flow (softDeleteAccount in
 * profile/deleteAccount.ts), this actually removes the document from Mongo
 * rather than flagging isDeleted — that's the whole point here: email and
 * primaryNumber both carry unique indexes, so a soft-deleted row would still
 * block re-registering with the same identifier during manual testing.
 */
export async function hardDeleteUser(id: string): Promise<{ success: boolean; message?: string }> {
  if (!id) return { success: false, message: "Missing user id." };

  await dbConnect();

  const result = await User.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return { success: false, message: "User not found." };
  }
  return { success: true };
}
