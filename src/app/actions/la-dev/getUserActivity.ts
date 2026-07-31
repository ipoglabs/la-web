"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";

export interface LaDevActivityEntry {
  id: string;
  action: string;
  metadata?: Record<string, unknown>;
  at: string;
}

export interface LaDevUserActivity {
  counts: Record<string, number>;
  recent: LaDevActivityEntry[];
}

/** Activity counts + recent feed for one user — admin-only, see la-dev/page.tsx. */
export async function getUserActivity(userId: string): Promise<LaDevUserActivity> {
  if (!Types.ObjectId.isValid(userId)) return { counts: {}, recent: [] };
  await dbConnect();

  const uid = new Types.ObjectId(userId);

  const grouped = await ActivityLog.aggregate<{ _id: string; count: number }>([
    { $match: { userId: uid } },
    { $group: { _id: "$action", count: { $sum: 1 } } },
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g._id, g.count]));

  const recent = await ActivityLog.find({ userId: uid })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean<{ _id: unknown; action: string; metadata?: Record<string, unknown>; createdAt: Date }[]>();

  return {
    counts,
    recent: recent.map((r) => ({
      id: String(r._id),
      action: r.action,
      metadata: r.metadata,
      at: new Date(r.createdAt).toISOString(),
    })),
  };
}
