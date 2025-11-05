// src/app/actions/getMyPosts.ts
"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { Types } from "mongoose";
import { toClientPost } from "@/lib/serialize";

type Params = { ownerId?: string; email?: string };

export async function getMyPosts({ ownerId, email }: Params = {}) {
  await connectDB();

  const or: any[] = [];
  if (ownerId && Types.ObjectId.isValid(ownerId)) or.push({ ownerId: new Types.ObjectId(ownerId) });
  if (email) {
    or.push({ $and: [{ "seller_info.email": { $type: "string" } }, { "seller_info.email": new RegExp(`^${email}$`, "i") }] });
  }
  if (or.length === 0) return [];

  const rows = await Post.find({ $or: or }).sort({ updatedAt: -1 }).lean();
  return rows.map(toClientPost);
}
