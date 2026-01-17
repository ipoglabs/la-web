// src/app/actions/getMyPosts.ts
"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { Types } from "mongoose";
import { toClientPost } from "@/lib/serialize";

type Params = { ownerId?: string; email?: string };

// escape regex special chars
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getMyPosts({ ownerId, email }: Params = {}) {
  await connectDB();

  const or: any[] = [];

  if (ownerId && Types.ObjectId.isValid(ownerId)) {
    or.push({ ownerId: new Types.ObjectId(ownerId) });
  }

  if (email) {
    const safe = escapeRegex(String(email).trim());
    or.push({
      $and: [
        { "seller_info.email": { $type: "string" } },
        { "seller_info.email": new RegExp(`^${safe}$`, "i") },
      ],
    });
  }

  if (or.length === 0) return [];

  // ✅ select the fields your My Ads UI needs (status + lastBumpedAt are required for bump UI)
  const rows = await Post.find({ $or: or })
    .sort({ updatedAt: -1 })
    .select([
      "_id",
      "name",
      "category",
      "subcategory",
      "images",
      "updatedAt",
      "status",
      "lastBumpedAt",
    ])
    .lean();

  // Keep your existing serializer, but ensure status/lastBumpedAt/thumb exist
  return rows.map((r: any) => {
    const base: any = toClientPost(r);

    // Fallbacks in case serializer doesn't include them
    if (base.status === undefined) base.status = r.status;
    if (base.lastBumpedAt === undefined)
      base.lastBumpedAt = r.lastBumpedAt ? new Date(r.lastBumpedAt).toISOString() : null;

    // If your UI expects thumb, ensure it exists
    if (base.thumb === undefined) {
      base.thumb = Array.isArray(r.images) && r.images.length > 0 ? r.images[0] : null;
    }

    // If your UI expects id, ensure it exists (many serializers already do)
    if (base.id === undefined) base.id = r._id?.toString?.() || String(r._id);

    // Ensure updatedAt is a string if your UI uses it as string
    if (base.updatedAt === undefined && r.updatedAt) {
      base.updatedAt = new Date(r.updatedAt).toISOString();
    }

    return base;
  });
}
