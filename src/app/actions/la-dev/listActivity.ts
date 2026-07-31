"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import User from "@/models/user";

export interface LaDevActivityFeedEntry {
  id: string;
  action: string;
  metadata?: Record<string, unknown>;
  at: string;
  user: { id: string; userId: string; fullName: string; email?: string };
}

type PopulatedUser = { _id: Types.ObjectId; userId: string; fullName: string; email?: string };

type ActivityLean = {
  _id: unknown;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  userId: PopulatedUser | null;
};

/**
 * Global activity feed across all users, newest first — admin-only, see
 * la-dev/page.tsx. Ensures the User model is registered before populate()
 * resolves the "User" ref (see models/ActivityLog.ts).
 */
export async function listActivity(limit = 200): Promise<LaDevActivityFeedEntry[]> {
  void User;
  await dbConnect();

  const entries = await ActivityLog.find({})
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 500))
    .populate<{ userId: PopulatedUser | null }>("userId", "userId fullName email")
    .lean<ActivityLean[]>();

  return entries
    .filter((e): e is ActivityLean & { userId: PopulatedUser } => e.userId != null)
    .map((e) => ({
      id: String(e._id),
      action: e.action,
      metadata: e.metadata,
      at: new Date(e.createdAt).toISOString(),
      user: {
        id: String(e.userId._id),
        userId: e.userId.userId,
        fullName: e.userId.fullName,
        email: e.userId.email,
      },
    }));
}
