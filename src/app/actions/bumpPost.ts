"use server";

import { cookies, headers } from "next/headers";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { verifyToken } from "@/lib/auth";

function extractEmailFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  return (
    decoded.email ||
    decoded.user?.email ||
    (typeof decoded.sub === "string" && decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

function extractUserIdFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  return (
    decoded.id ||
    decoded.userId ||
    decoded.user?.id ||
    (typeof decoded.sub === "string" && !decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

export async function bumpPost(postId: string) {
  try {
    await connectDB();

    const cookieStore = cookies();
    const hdrs = headers();

    let raw = cookieStore.get("session")?.value || hdrs.get("authorization") || "";
    if (raw?.startsWith("Bearer ")) raw = raw.slice("Bearer ".length).trim();

    const decoded = raw ? verifyToken(raw) : null;
    const ownerEmail = extractEmailFromDecoded(decoded);
    const ownerId = extractUserIdFromDecoded(decoded);

    if (!ownerEmail && !ownerId) {
      return { ok: false as const, error: "Not logged in" };
    }

    const post = await Post.findById(postId).exec();
    if (!post) return { ok: false as const, error: "Post not found" };

    const owned =
      (ownerId && post.ownerId && post.ownerId.toString() === String(ownerId)) ||
      (ownerEmail &&
        post.seller_info?.email?.toLowerCase() === ownerEmail.toLowerCase());

    if (!owned) return { ok: false as const, error: "Not allowed" };

    if (post.status !== "active") {
      return {
        ok: false as const,
        error: "Only approved (active) ads can be bumped.",
      };
    }

    post.lastBumpedAt = new Date();
    await post.save();

    return {
      ok: true as const,
      lastBumpedAt: post.lastBumpedAt.toISOString(),
    };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || "Bump failed" };
  }
}
