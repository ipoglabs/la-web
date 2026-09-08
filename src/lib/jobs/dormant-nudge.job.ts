/**
 * lib/jobs/dormant-nudge.job.ts
 *
 * Runs every day at 09:30 (30 9 * * *).
 *
 * Audits users who have not signed in for DORMANT_THRESHOLD_DAYS (180 days ≈
 * 6 months) and sends each ONE "it's been a while" nudge email with a link
 * back to the site.
 *
 * "Send exactly one" is enforced with `dormantNudgedAt` on the user:
 *   - This job sets it right after a successful send.
 *   - createUserSession() ($unset in lib/userSession.ts) clears it on the
 *     user's next login.
 * So a user is nudged at most once per dormancy spell, but a user who
 * returns and later goes quiet again for 180+ days becomes eligible afresh.
 *
 * MARKETING_OPT_IN_ONLY: this is a re-engagement email, not transactional —
 * we only send to users who opted in to marketing. Flip the constant to
 * false to send to every dormant user regardless.
 *
 * MAX_PER_RUN caps a single run so the first execution against a large
 * backlog doesn't fire thousands of emails at once — the daily cron drains
 * the rest over subsequent days (oldest logins first).
 *
 * TODO [scalability]: swap User.find().lean() for
 * User.find(...).cursor().eachAsync(fn, { parallel: 10 }) once the dormant
 * set is large enough that loading a page of it into memory matters.
 */

import dbConnect from "@/lib/db";
import User from "@/models/user";
import { sendEmail } from "@/lib/email";
import type { JobResult } from "@/lib/jobs/_types";

const DORMANT_THRESHOLD_DAYS = 180;
const MARKETING_OPT_IN_ONLY = true;
const MAX_PER_RUN = 200;

const DAY_MS = 24 * 60 * 60 * 1000;

interface DormantUser {
  _id: unknown;
  email?: string;
  fullName?: string;
  lastLoginAt?: Date;
}

export async function runDormantNudgeJob(): Promise<JobResult> {
  await dbConnect();

  const result: JobResult = {
    alertsProcessed: 0,
    matchesFound: 0,
    emailsSent: 0,
    whatsappSent: 0,
    errors: 0,
    usersProcessed: 0,
  };

  const cutoff = new Date(Date.now() - DORMANT_THRESHOLD_DAYS * DAY_MS);

  const query: Record<string, unknown> = {
    accountStatus: "Active",
    isDeleted: { $ne: true },
    isSuspended: { $ne: true },
    email: { $exists: true, $nin: [null, ""] },
    lastLoginAt: { $lte: cutoff },
    dormantNudgedAt: { $exists: false },
  };
  if (MARKETING_OPT_IN_ONLY) query.marketingOptIn = true;

  const users = await User.find(query)
    .select("email fullName lastLoginAt")
    .sort({ lastLoginAt: 1 }) // oldest logins first — fair drain of the backlog
    .limit(MAX_PER_RUN)
    .lean<DormantUser[]>();

  result.usersProcessed = users.length;

  for (const user of users) {
    try {
      if (!user.email) {
        result.errors++;
        continue;
      }

      const fullName = (user.fullName ?? "").trim();
      const firstName = fullName.split(/\s+/)[0] || "there";

      const daysAway = user.lastLoginAt
        ? Math.floor((Date.now() - new Date(user.lastLoginAt).getTime()) / DAY_MS)
        : DORMANT_THRESHOLD_DAYS;
      const monthsAway = Math.max(6, Math.floor(daysAway / 30));

      const emailResult = await sendEmail({
        type: "DORMANT_NUDGE",
        to: user.email,
        data: { firstName, monthsAway },
      });

      if (emailResult.success) {
        result.emailsSent++;
        // Mark as nudged only on a successful send, so a failed send is
        // retried on the next cron cycle rather than silently skipped.
        await User.updateOne(
          { _id: user._id },
          { $set: { dormantNudgedAt: new Date() } },
        );
      } else {
        result.errors++;
        console.error(
          `[dormant-nudge] send failed for user ${String(user._id)}:`,
          emailResult.error,
        );
      }
    } catch (err) {
      console.error(
        `[dormant-nudge] error processing user ${String(user._id)}:`,
        err,
      );
      result.errors++;
    }
  }

  return result;
}
