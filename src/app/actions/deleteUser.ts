"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import Post from "@/models/post";
import { Types } from "mongoose";

/**
 * Deletes a user + (optional) deletes all posts owned by that user.
 * NOTE: If you also want to delete posts created only by seller_info.email
 * (posts without ownerId), tell me and I’ll add it safely.
 */
export async function deleteUser(userId: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(userId)) {
      return { ok: false, error: "Invalid user id" };
    }

    const uid = new Types.ObjectId(userId);

    // ✅ delete posts for that ownerId
    await Post.deleteMany({ ownerId: uid });

    const res = await User.findByIdAndDelete(uid).lean();
    if (!res) return { ok: false, error: "User not found" };

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Delete failed" };
  }
}
