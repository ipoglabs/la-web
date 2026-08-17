"use server";

import { cookies, headers } from "next/headers";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";
import { getBumpCooldownHours, type CountryCode } from "@/config";

const COUNTRY_CODES: CountryCode[] = ["in", "gb", "sg"];

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
    decoded.userId ||
    decoded.id ||
    decoded.user?.id ||
    (typeof decoded.sub === "string" && !decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

/** postId may be a real Post's adsId (MyAdCard's `ad.id`) or a raw Mongo
 *  _id — same dual lookup as getPostByAdsId.ts / setListingLifecycle.ts. */
function findByPublicId(postId: string) {
  const query = Types.ObjectId.isValid(postId)
    ? { $or: [{ adsId: postId }, { _id: postId }] }
    : { adsId: postId };
  return Post.findOne(query);
}

/** Minutes remaining until the next bump is allowed, or 0 if bump is available now. */
function cooldownRemainingMs(lastBumpedAt: Date | undefined, countryCode: string | undefined): number {
  const code = COUNTRY_CODES.includes(countryCode as CountryCode) ? (countryCode as CountryCode) : "in";
  const cooldownMs = getBumpCooldownHours(code) * 60 * 60 * 1000;
  if (!lastBumpedAt) return 0;
  return Math.max(0, lastBumpedAt.getTime() + cooldownMs - Date.now());
}

export async function bumpPost(postId: string) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const hdrs = await headers();

    let raw =
      cookieStore.get("session")?.value ||
      cookieStore.get("token")?.value ||
      hdrs.get("authorization") ||
      "";

    if (raw.startsWith("Bearer ")) {
      raw = raw.slice(7).trim();
    }

    const decoded = raw ? verifyToken(raw) : null;

    const ownerEmail = extractEmailFromDecoded(decoded);
    const ownerId = extractUserIdFromDecoded(decoded);

    if (!ownerEmail && !ownerId) {
      return { ok: false as const, error: "Not logged in" };
    }

    const post = await findByPublicId(postId).exec();
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

    // Never trust a client-side cooldown check alone — MyAdCard's button
    // already disables itself, but the server must enforce this too.
    const remainingMs = cooldownRemainingMs(post.lastBumpedAt, post.country);
    if (remainingMs > 0) {
      return {
        ok: false as const,
        error: `You can bump this ad again in ${Math.ceil(remainingMs / 60_000)} minute(s).`,
      };
    }

    post.lastBumpedAt = new Date();
    await post.save();

    if (post.ownerId) {
      await logActivity(post.ownerId, "POST_BUMPED", { postId: String(post._id), title: post.name });
    }

    return {
      ok: true as const,
      lastBumpedAt: post.lastBumpedAt.toISOString(),
    };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || "Bump failed" };
  }
}
