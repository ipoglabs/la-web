// src/app/actions/getPostById.ts
"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { Types } from "mongoose";
import { toClientPost } from "@/lib/serialize";

export async function getPostById(id: string) {
  if (!id || !Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doc = await Post.findById(new Types.ObjectId(id)).lean();
  return toClientPost(doc);
}
