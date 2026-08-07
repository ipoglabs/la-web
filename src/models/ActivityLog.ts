import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

/**
 * Per-event user activity — separate from User.audit[] (kept for
 * infrequent account-level milestones like ACCOUNT_DELETED). Some of these
 * actions (MESSAGE_SENT in particular) are high-frequency, and an array
 * embedded in the User document would risk hitting Mongo's 16MB document
 * cap for an active user — a dedicated, indexed collection scales to any
 * volume and supports counting/filtering per user.
 */
export type ActivityAction =
  | "REGISTERED"
  | "LOGIN"
  | "EMAIL_CHANGED"
  | "PHONE_CHANGED"
  | "NAME_CHANGED"
  | "USERID_CHANGED"
  | "ROLE_CHANGED"
  | "DOB_CHANGED"
  | "GENDER_CHANGED"
  | "PASSWORD_CHANGED"
  | "POST_CREATED"
  | "POST_UPDATED"
  | "POST_BUMPED"
  | "POST_DELETED"
  | "MESSAGE_SENT"
  | "AD_APPROVED"
  | "AD_REJECTED"
  | "AD_SET_PENDING"
  | "AD_SUSPENDED"
  | "AD_RESTORED"
  | "AD_REPORT_REVIEWED"
  | "AD_REPORT_DISMISSED";

export interface IActivityLog {
  userId: mongoose.Types.ObjectId;
  action: ActivityAction;
  metadata?: Record<string, unknown>;
  /** Who performed the action, when different from `userId` (the subject
   * whose feed this entry shows up in) — e.g. an admin moderating someone
   * else's ad. Unset for ordinary self-service events. */
  actorId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export type IActivityLogDoc = HydratedDocument<IActivityLog>;

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Primary access pattern: "this user's activity, newest first" (optionally
// filtered by action) — see getUserAuditDetail.ts in dev-tools.
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, action: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  (mongoose.models.ActivityLog as Model<IActivityLog>) ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
