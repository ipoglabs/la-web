/**
 * app/api/jobs/trigger/route.ts
 *
 * Manual job trigger — dev and staging use only.
 * Requires CRON_SECRET header for basic security.
 *
 * POST /api/jobs/trigger
 * Header: x-cron-secret: <CRON_SECRET>
 * Body:   { "job": "alert-match" | "alert-digest-daily" | "alert-digest-weekly" | "alert-no-match" }
 *
 * Returns immediately — job runs in the background.
 * Check job status via the JobRun collection.
 *
 * SECURITY: This route should be disabled or protected behind a VPN in production.
 * The CRON_SECRET is a shared secret — rotate it regularly.
 */

import { runJob } from "@/lib/jobs/_runner";
import { runAlertMatchJob } from "@/lib/jobs/alert-match.job";
import { runAlertDigestJob } from "@/lib/jobs/alert-digest.job";
import { runAlertNoMatchJob } from "@/lib/jobs/alert-no-match.job";
import type { JobName } from "@/lib/jobs/_types";

const JOB_MAP: Record<JobName, () => Promise<import("@/lib/jobs/_types").JobResult>> = {
  "alert-match": runAlertMatchJob,
  "alert-digest-daily": () => runAlertDigestJob("daily"),
  "alert-digest-weekly": () => runAlertDigestJob("weekly"),
  "alert-no-match": runAlertNoMatchJob,
};

const VALID_JOB_NAMES = Object.keys(JOB_MAP) as JobName[];

export async function POST(request: Request): Promise<Response> {
  // Validate the shared secret before doing anything
  // Note: string equality is sufficient here — this is a dev/staging tool, not a
  // public auth endpoint. For a production-exposed trigger, use timingSafeEqual.
  const secret = request.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  if (!secret || secret !== expected) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { job?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const jobName = body.job;
  if (!jobName || !VALID_JOB_NAMES.includes(jobName as JobName)) {
    return Response.json(
      { error: "Invalid job name", valid: VALID_JOB_NAMES },
      { status: 400 },
    );
  }

  const jobFn = JOB_MAP[jobName as JobName];

  // Fire and forget — caller gets an immediate 202 Accepted
  runJob(jobName as JobName, jobFn).catch((err) =>
    console.error(`[api/jobs/trigger] unhandled error running ${jobName}:`, err),
  );

  return Response.json({ queued: jobName }, { status: 202 });
}
