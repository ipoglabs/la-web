"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { getSession } from "@/lib/auth";
import { deleteImageVariants } from "@/lib/media/imageVariants";
import { logActivity } from "@/lib/activityLog";

function normEmail(v?: string | null) {
  return v ? v.trim().toLowerCase() : undefined;
}

export async function deletePost(postId: string) {
  if (!postId) return { ok: false, error: "Missing post id" };

  await connectDB();

  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthenticated" };

  const sessionUserId = session.userId;
  const sessionEmail = normEmail(session.email);

  const doc = await Post.findById(postId);
  if (!doc) return { ok: false, error: "Post not found" };

  // ownerId is the authoritative check (matches updatePost.ts/bumpPost.ts) —
  // seller_info.email is a snapshot captured at posting time that goes stale
  // the moment the owner changes their email (updateContact.ts never
  // refreshes it), so it's kept only as a fallback for legacy posts that
  // predate ownerId.
  const hasOwnerMatch =
    !!sessionUserId &&
    !!doc.ownerId &&
    Types.ObjectId.isValid(sessionUserId) &&
    String(doc.ownerId) === String(sessionUserId);

  const hasEmailMatch =
    !!sessionEmail && normEmail(doc.seller_info?.email) === sessionEmail;

  if (!hasOwnerMatch && !hasEmailMatch) {
    return { ok: false, error: "Not allowed" };
  }

  // Delete all R2 image variants before removing the record so we don't lose
  // the image URL list. Fire-and-forget — a failed R2 cleanup must not block
  // the user from deleting their post.
  const imageUrls = (doc.images ?? []) as string[];
  if (imageUrls.length > 0) {
    deleteImageVariants(imageUrls).catch((e) =>
      console.error("R2 cleanup error during deletePost:", e)
    );
  }

  await Post.deleteOne({ _id: postId });

  if (doc.ownerId) {
    await logActivity(doc.ownerId, "POST_DELETED", { postId, title: doc.name });
  }

  revalidatePath("/my-ads");
  return { ok: true };
}
