/**
 * lib/jobs/alert-no-match.job.ts
 *
 * Runs every day at 09:00 (0 9 * * *).
 *
 * Finds active alerts where noMatchSince is 14+ days ago and sends a
 * "no matches yet" nudge email to the owner.
 *
 * After sending, noMatchSince is $unset so the 14-day clock resets.
 * If the alert still finds no matches on the next cron cycle, the match jobs
 * will re-set noMatchSince and the countdown begins again.
 *
 * TODO [scalability]: For large alert collections, replace Alert.find().lean()
 * with cursor-based streaming: Alert.find(...).cursor().eachAsync(fn, { parallel: 10 })
 * to avoid loading all matching alerts into memory at once.
 */

import dbConnect from "@/lib/db";
import Alert from "@/lib/models/Alert";
import { sendEmail } from "@/lib/email";
import type { JobResult } from "@/lib/jobs/_types";

const NO_MATCH_THRESHOLD_DAYS = 14;

export async function runAlertNoMatchJob(): Promise<JobResult> {
  await dbConnect();

  const result: JobResult = { alertsProcessed: 0, matchesFound: 0, emailsSent: 0, errors: 0 };

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NO_MATCH_THRESHOLD_DAYS);

  const alerts = await Alert.find({
    isActive: true,
    noMatchSince: { $lte: cutoff },
  }).lean();

  result.alertsProcessed = alerts.length;

  for (const alert of alerts) {
    try {
      // TODO [auth-integration]: Replace placeholder with real user email lookup:
      //   const user = await User.findById(alert.userId).select("email").lean();
      //   if (!user?.email) { result.errors++; continue; }
      const emailResult = await sendEmail({
        type: "ALERT_NO_MATCHES",
        to: `user-${alert.userId}@placeholder.invalid`,
        data: {
          alertName: alert.name,
          alertId: String(alert._id),
        },
      });

      if (emailResult.success) result.emailsSent++;
      else result.errors++;

      // $unset clears the field in MongoDB — setting to undefined would be silently ignored
      await Alert.findByIdAndUpdate(alert._id, { $unset: { noMatchSince: 1 } });
    } catch (err) {
      console.error(`[alert-no-match] error processing alert ${alert._id}:`, err);
      result.errors++;
    }
  }

  return result;
}

