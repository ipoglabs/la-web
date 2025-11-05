// src/app/actions/getMyPosts.ts
"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import mongoose, { Types } from "mongoose";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Params = { ownerId?: string; email?: string };

export async function getMyPosts({ ownerId, email }: Params = {}) {
  await connectDB();

  const or: any[] = [];

  if (ownerId && Types.ObjectId.isValid(ownerId)) {
    or.push({ ownerId: new Types.ObjectId(ownerId) });
  }

  if (email) {
    const rx = new RegExp(`^${escapeRegex(email)}$`, "i");
    or.push({
      $and: [
        { "seller_info.email": { $type: "string" } },
        { "seller_info.email": rx },
      ],
    });
  }

  if (or.length === 0) return [];

  const rows = await Post.find({ $or: or })
    .sort({ updatedAt: -1 })
    .collation({ locale: "en", strength: 2 })
    .lean();

  // 🔑 Make them 100% plain + add `id`
  return rows.map((r: any) => {
    const plain = JSON.parse(JSON.stringify(r));
    plain.id = String(plain.id ?? plain._id ?? "");
    delete plain._id;
    return plain;
  });
}
