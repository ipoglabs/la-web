"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { Types } from "mongoose";

type Params = { ownerId?: string; email?: string };

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getMyPosts({ ownerId, email }: Params = {}) {
  await connectDB();

  if (!ownerId || !Types.ObjectId.isValid(ownerId)) {
    return [];
  }

  const ownerObjectId = new Types.ObjectId(ownerId);

  let query: any = { ownerId: ownerObjectId };

  // fallback for old data
  if (email) {
    const safe = escapeRegex(email.trim());

    query = {
      $or: [
        { ownerId: ownerObjectId },
        {
          $and: [
            { ownerId: { $exists: false } },
            { "seller_info.email": new RegExp(`^${safe}$`, "i") },
          ],
        },
      ],
    };
  }

  const rows = await Post.find(query).sort({ updatedAt: -1 }).lean();

  return rows.map((r: any) => ({
    id: r._id.toString(),
    name: r.name,
    category: r.category,
    subcategory: r.subcategory,
    status: r.status ?? "pending",
    images: Array.isArray(r.images) ? r.images : [],
    updatedAt: r.updatedAt?.toISOString?.() || null,
    lastBumpedAt: r.lastBumpedAt?.toISOString?.() || null,
    thumb: r.images?.[0] || null,
  }));
}