"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Post from "@/models/post";
import { deleteImageVariants } from "@/lib/media/imageVariants";

export async function deletePost(postId: string, callerEmail: string) {
  if (!postId) return { ok: false, error: "Missing post id" };
  if (!callerEmail) return { ok: false, error: "Unauthenticated" };

  await connectDB();

  const doc = await Post.findById(postId);
  if (!doc) return { ok: false, error: "Post not found" };

  if (doc.seller_info?.email !== callerEmail) {
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

  revalidatePath("/my-ads");
  return { ok: true };
}
