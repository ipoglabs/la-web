"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";

export async function updatePostStatus(
  postId: string,
  status: "active" | "off" | "expired"
) {
  try {
    await connectDB();

    const updated = await Post.findByIdAndUpdate(
      postId,
      { status, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!updated) return { ok: false, error: "Post not found" };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Update failed" };
  }
}
