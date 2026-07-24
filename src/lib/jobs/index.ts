/**
 * lib/jobs/index.ts
 *
 * Job runner entry point — registers all cron schedules.
 * Called ONCE at startup from instrumentation.ts (Node.js runtime only).
 *
 * Schedules (cron syntax):
 *   every 5 min   alert-match           (instant alerts)
 *   0 8 daily     alert-digest-daily
 *   0 8 monday    alert-digest-weekly
 *   0 9 daily     alert-no-match        (14-day check)
 */

import cron from "node-cron";
import { runJob } from "@/lib/jobs/_runner";
import { runAlertMatchJob } from "@/lib/jobs/alert-match.job";
import { runAlertDigestJob } from "@/lib/jobs/alert-digest.job";
import { runAlertNoMatchJob } from "@/lib/jobs/alert-no-match.job";

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

  console.log("[jobs] scheduler started — 4 jobs registered");
}
