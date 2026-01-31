"use server";

import { cookies, headers } from "next/headers";
import connectDB from "@/config/database";
import Post from "@/models/post";
import { verifyToken } from "@/lib/auth";

function isAllowedToModeratePosts(role?: string) {
  // ✅ you can tune this later
  return ["super_admin", "admin", "moderator"].includes(String(role));
}

export async function updatePostStatus(
  postId: string,
  status: "active" | "off" | "expired"
) {
  try {
    // ✅ auth guard
    const cookieStore = cookies();
    const hdrs = headers();

    let raw = cookieStore.get("session")?.value || hdrs.get("authorization") || "";
    if (raw?.startsWith("Bearer ")) raw = raw.slice("Bearer ".length).trim();

    const decoded: any = raw ? verifyToken(raw) : null;
    const role = decoded?.role;

    if (!decoded || !isAllowedToModeratePosts(role)) {
      return { ok: false, error: "Forbidden" };
    }

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
