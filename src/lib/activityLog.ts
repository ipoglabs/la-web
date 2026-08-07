import type { Types } from "mongoose";
import dbConnect from "@/lib/db";
import ActivityLog, { type ActivityAction } from "@/models/ActivityLog";

/**
 * Fire-and-forget activity log — swallows its own errors so a logging
 * failure can never break the feature it's attached to (login, profile
 * edits, posting, chat). See models/ActivityLog.ts for why this is a
 * separate collection rather than User.audit[].
 */
export async function logActivity(
  userId: string | Types.ObjectId,
  action: ActivityAction,
  metadata?: Record<string, unknown>,
  actorId?: string | Types.ObjectId
): Promise<void> {
  try {
    await dbConnect();
    await ActivityLog.create({ userId, action, metadata, actorId });
  } catch (err) {
    console.error("[logActivity]", action, err);
  }
}
