/**
 * app/api/internal/account-status/route.ts
 *
 * Called by the back office (lokalads-bo) after staff suspend or unsuspend a
 * user, so the user hears about it by email (ACCOUNT_STATUS):
 *   suspended               → "your account has been suspended", with the
 *                             support page to appeal
 *   active again, after a   → "your account has been reinstated"
 *   suspension email
 *
 * No reason is sent: the back office's reason is an internal note.
 *
 * Auth: `Authorization: Bearer $BO_NOTIFY_SECRET` (see lib/boNotifyAuth.ts).
 * Body: { "userId": "<Mongo _id>" }. The state is read from the database, and
 * User.accountStatusEmailFor is claimed atomically before sending, so each
 * change is emailed once and only if true.
 *
 * Responses: 200 { sent: true } | 200 { sent: false, skipped } | 401 | 400 |
 * 502 email provider failed (claim released, so a retry can send).
 */

import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { sendEmail } from "@/lib/email";
import { isEmailMutedUser } from "@/lib/emailMutedUsers";
import { boNotifyAuthorised } from "@/lib/boNotifyAuth";

const json = (body: unknown, status = 200) => Response.json(body, { status });

type UserState = {
  _id: mongoose.Types.ObjectId;
  email?: string;
  fullName?: string;
  isDeleted?: boolean;
  isSuspended?: boolean;
  accountStatus?: string;
  accountStatusEmailFor?: string;
};

export async function POST(req: Request) {
  if (!boNotifyAuthorised(req)) return json({ error: "unauthorised" }, 401);

  const body = (await req.json().catch(() => null)) as { userId?: unknown } | null;
  const userId = typeof body?.userId === "string" ? body.userId : "";
  if (!mongoose.Types.ObjectId.isValid(userId)) return json({ error: "userId required" }, 400);

  await dbConnect();

  const user = await User.findById(userId)
    .select("email fullName isDeleted isSuspended accountStatus accountStatusEmailFor")
    .lean<UserState>();
  if (!user) return json({ sent: false, skipped: "no such user" });
  if (user.isDeleted || user.accountStatus === "Deleted") return json({ sent: false, skipped: "account closed" });

  const suspended = user.isSuspended === true || user.accountStatus === "Suspended";
  // "Reinstated" only follows a suspension email; a user who was never told
  // they were suspended doesn't need to hear they're back.
  const notice = suspended ? "suspended" : user.accountStatusEmailFor === "suspended" ? "reinstated" : null;
  if (!notice) return json({ sent: false, skipped: "nothing to send" });

  const previous = user.accountStatusEmailFor;
  if (previous === notice) return json({ sent: false, skipped: `user already emailed (${notice})` });

  // Claim it: only if nobody else changed the marker since we read it.
  const claimed = await User.updateOne(
    { _id: userId, accountStatusEmailFor: previous ?? { $exists: false } },
    { $set: { accountStatusEmailFor: notice } },
  );
  if (claimed.modifiedCount === 0) return json({ sent: false, skipped: `user already emailed (${notice})` });
  const release = () =>
    User.updateOne(
      { _id: userId, accountStatusEmailFor: notice },
      previous ? { $set: { accountStatusEmailFor: previous } } : { $unset: { accountStatusEmailFor: 1 } },
    );

  if (isEmailMutedUser(user._id)) return json({ sent: false, skipped: "test account (EMAIL_MUTED_USER_IDS)" });
  if (!user.email) {
    await release();
    return json({ sent: false, skipped: "no email address for this user" });
  }

  const firstName = (user.fullName ?? "").trim().split(/\s+/)[0] || "there";
  const result = await sendEmail({
    type: "ACCOUNT_STATUS",
    to: user.email,
    data: { firstName, status: notice },
  });
  if (!result.success) {
    await release();
    return json({ sent: false, error: "email provider failed" }, 502);
  }
  return json({ sent: true });
}
