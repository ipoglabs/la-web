/**
 * lib/jobs/index.ts
 *
 * Job runner entry point — registers all cron schedules with node-cron.
 * Called ONCE at startup from instrumentation.ts, and ONLY off-Vercel
 * (`!process.env.VERCEL`): on Vercel these same jobs are driven by
 * vercel.json `crons` hitting /api/jobs/trigger, because the serverless
 * runtime has no persistent process for node-cron's timers. Keep the
 * schedules below identical to vercel.json `crons` and to SCHEDULE_TO_JOB
 * in app/api/jobs/trigger/route.ts.
 *
 * Schedules (cron syntax):
 *   every 5 min   alert-match           (instant alerts)
 *   0 8 * * *     alert-digest-daily
 *   0 8 * * 1     alert-digest-weekly
 *   0 9 * * *     alert-no-match        (14-day check)
 *   0 0 * * *     popular-search        (popular-searches aggregation)
 *   30 9 * * *    dormant-nudge         (180-day no-login check)
 */

import cron from "node-cron";
import { runJob } from "@/lib/jobs/_runner";
import { runAlertMatchJob } from "@/lib/jobs/alert-match.job";
import { runAlertDigestJob } from "@/lib/jobs/alert-digest.job";
import { runAlertNoMatchJob } from "@/lib/jobs/alert-no-match.job";
import { runPopularSearchJob } from "@/lib/jobs/popular-search.job";
import { runDormantNudgeJob } from "@/lib/jobs/dormant-nudge.job";

export function initJobRunner(): void {
  // Instant alert match — every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    runJob("alert-match", runAlertMatchJob).catch((err) =>
      console.error("[jobs] unhandled error in alert-match:", err),
    );
  });

  // Daily digest — every day at 08:00
  cron.schedule("0 8 * * *", () => {
    runJob("alert-digest-daily", () => runAlertDigestJob("daily")).catch((err) =>
      console.error("[jobs] unhandled error in alert-digest-daily:", err),
    );
  });

  // Weekly digest — every Monday at 08:00
  cron.schedule("0 8 * * 1", () => {
    runJob("alert-digest-weekly", () => runAlertDigestJob("weekly")).catch((err) =>
      console.error("[jobs] unhandled error in alert-digest-weekly:", err),
    );
  });

  // No-match nudge — every day at 09:00
  cron.schedule("0 9 * * *", () => {
    runJob("alert-no-match", runAlertNoMatchJob).catch((err) =>
      console.error("[jobs] unhandled error in alert-no-match:", err),
    );
  });

  // Popular search aggregation — every day at 00:00
  cron.schedule("0 0 * * *", () => {
    runJob("popular-search", runPopularSearchJob).catch((err) =>
      console.error("[jobs] unhandled error in popular-search:", err),
    );
  });

  // Dormant-user nudge — every day at 09:30 (180-day no-login check)
  cron.schedule("30 9 * * *", () => {
    runJob("dormant-nudge", runDormantNudgeJob).catch((err) =>
      console.error("[jobs] unhandled error in dormant-nudge:", err),
    );
  });

  console.log("[jobs] scheduler started — 6 jobs registered");
}
