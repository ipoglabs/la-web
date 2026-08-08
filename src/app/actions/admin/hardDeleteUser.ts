"use server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import Post from "@/models/post";
import ActivityLog from "@/models/ActivityLog";
import Session from "@/models/session";
import Alert from "@/models/Alert";
import { requireAdminId } from "@/lib/requireAdmin";
import { deleteImageVariants } from "@/lib/media/imageVariants";

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
 *
 * Cascades to every collection that's *exclusively* owned by this user —
 * Post (their own ads), ActivityLog (their own audit trail), Session (their
 * own devices), Alert (their own saved searches) — so re-registering with
 * the same identifier doesn't leave dangling rows pointing at a userId that
 * no longer exists. Deliberately does NOT touch Conversation/Message: those
 * are shared with another real participant, and both `api/conversations`
 * routes already null-guard a missing populated participant (falls back to
 * "Unknown"), so leaving them in place is safe and preserves the
 * counterparty's chat history. Review is skipped — the model has zero real
 * read/write paths (profile "reviews" are hardcoded mock data).
 */
export async function hardDeleteUser(id: string): Promise<{ success: boolean; message?: string }> {
  const adminId = await requireAdminId();
  if (!adminId) return { success: false, message: "Forbidden." };

  if (!id) return { success: false, message: "Missing user id." };

  await dbConnect();

  const posts = await Post.find({ ownerId: id }).select("images").lean();
  const imageUrls = posts.flatMap((p) => (p.images ?? []) as string[]);
  if (imageUrls.length > 0) {
    deleteImageVariants(imageUrls).catch((e) =>
      console.error("R2 cleanup error during hardDeleteUser:", e)
    );
  }

  await Promise.all([
    Post.deleteMany({ ownerId: id }),
    ActivityLog.deleteMany({ userId: id }),
    Session.deleteMany({ userId: id }),
    Alert.deleteMany({ userId: id }),
  ]);

  const result = await User.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return { success: false, message: "User not found." };
  }
  return { success: true };
}
