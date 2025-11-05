"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Post from "@/models/post";

/**
 * Hard-delete a post; validates that the caller owns the post
 * by matching seller_info.email with callerEmail.
 */
export async function deletePost(postId: string, callerEmail: string) {
  if (!postId) return { ok: false, error: "Missing post id" };
  if (!callerEmail) return { ok: false, error: "Unauthenticated" };

  await connectDB();

  const doc = await Post.findById(postId);
  if (!doc) return { ok: false, error: "Post not found" };

  if (doc.seller_info?.email !== callerEmail) {
    return { ok: false, error: "Not allowed" };
  }

  await Post.deleteOne({ _id: postId });

  // refresh the listing
  revalidatePath("/my-ads");
  return { ok: true };
}
