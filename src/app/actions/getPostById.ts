// app/actions/getPostById.ts
"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";

/** Returns a fully-serializable post or null */
export async function getPostById(id: string) {
  await connectDB();

  // Use .lean() to get plain object
  const doc = await Post.findById(id).lean().exec();
  if (!doc) return null;

  // Normalize _id -> id and remove Mongoose internals
  const { _id, __v, ...rest } = doc as any;

  return {
    id: String(_id),
    ...rest,
  };
}
