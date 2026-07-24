/**
 * lib/jobs/_runner.ts
 *
 * Shared job wrapper used by every cron job.
 *
 * Responsibilities:
 *  1. Write a JobRun "running" record to DB before the job starts
 *  2. Call the job function
 *  3. On success: update status → "completed" + write stats
 *  4. On error:   update status → "failed" + write error message
 *
 * Usage:
 *   import { runJob } from "@/lib/jobs/_runner";
 *   await runJob("alert-match", runAlertMatchJob);
 */

import dbConnect from "@/lib/db";
import JobRun from "@/lib/models/JobRun";
import type { JobName, JobResult } from "@/lib/jobs/_types";

export async function runJob(
  name: JobName,
  jobFn: () => Promise<JobResult>,
): Promise<void> {
  await dbConnect();

  const run = await JobRun.create({
    jobName: name,
    startedAt: new Date(),
    status: "running",
    stats: { alertsProcessed: 0, matchesFound: 0, emailsSent: 0, errors: 0 },
  });

  try {
    const result = await jobFn();

    await JobRun.findByIdAndUpdate(run._id, {
      status: "completed",
      completedAt: new Date(),
      stats: result,
    });

    console.log(`[jobs/${name}] completed`, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await JobRun.findByIdAndUpdate(run._id, {
      status: "failed",
      completedAt: new Date(),
      error: message,
    });

    console.error(`[jobs/${name}] failed:`, message);
  }
}
