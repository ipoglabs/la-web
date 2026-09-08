/**
 * app/api/jobs/trigger/route.ts
 *
 * Fires a batch job on demand. Two callers:
 *
 *  1. Vercel Cron (production) — GET, with `Authorization: Bearer $CRON_SECRET`
 *     injected automatically by Vercel. Job selected by `?job=<name>` in the
 *     cron `path` (see vercel.json `crons`); falls back to mapping the
 *     `x-vercel-cron-schedule` header (each job has a unique schedule).
 *  2. Manual / local (dev, staging) — GET or POST, authorised with either
 *     `Authorization: Bearer <secret>` or the legacy `x-cron-secret: <secret>`
 *     header. Job from `?job=` or a JSON body `{ "job": "<name>" }`.
 *
 * The handler AWAITS the job and returns its JobResult. A fire-and-forget
 * 202 would be unsafe on Vercel's serverless runtime, where the function can
 * be frozen the instant the response is sent — killing an unawaited job.
 *
 * In local dev / self-hosted deploys the in-process node-cron scheduler
 * (instrumentation.ts -> lib/jobs/index.ts) runs these same jobs. That path
 * is disabled when `process.env.VERCEL` is set, so the two never double-fire.
 *
 * CRON_SECRET must be set in every environment. Rotate it periodically.
 */

import { timingSafeEqual } from "crypto";
import { runJob } from "@/lib/jobs/_runner";
import { runAlertMatchJob } from "@/lib/jobs/alert-match.job";
import { runAlertDigestJob } from "@/lib/jobs/alert-digest.job";
import { runAlertNoMatchJob } from "@/lib/jobs/alert-no-match.job";
import { runPopularSearchJob } from "@/lib/jobs/popular-search.job";
import { runDormantNudgeJob } from "@/lib/jobs/dormant-nudge.job";
import type { JobName, JobResult } from "@/lib/jobs/_types";

// The route runs as long as its slowest job — give it headroom over the
// platform default. Vercel clamps this to the project's plan ceiling.
export const maxDuration = 300;

const JOB_MAP: Record<JobName, () => Promise<JobResult>> = {
  "alert-match": runAlertMatchJob,
  "alert-digest-daily": () => runAlertDigestJob("daily"),
  "alert-digest-weekly": () => runAlertDigestJob("weekly"),
  "alert-no-match": runAlertNoMatchJob,
  "popular-search": runPopularSearchJob,
  "dormant-nudge": runDormantNudgeJob,
};

const VALID_JOB_NAMES = Object.keys(JOB_MAP) as JobName[];

// Fallback job resolution for Vercel Cron: every job has a unique schedule,
// so the `x-vercel-cron-schedule` header alone identifies it if the `?job=`
// query param is ever dropped. Keep in sync with vercel.json `crons` and
// lib/jobs/index.ts.
const SCHEDULE_TO_JOB: Record<string, JobName> = {
  "*/5 * * * *": "alert-match",
  "0 8 * * *": "alert-digest-daily",
  "0 8 * * 1": "alert-digest-weekly",
  "0 9 * * *": "alert-no-match",
  "0 0 * * *": "popular-search",
  "30 9 * * *": "dormant-nudge",
};

function secretsMatch(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Returns null when authorised, otherwise the Response to send back. */
function authorize(request: Request): Response | null {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const legacy = request.headers.get("x-cron-secret");

  const ok =
    (bearer !== null && secretsMatch(bearer, expected)) ||
    (legacy !== null && secretsMatch(legacy, expected));

  return ok ? null : Response.json({ error: "Forbidden" }, { status: 403 });
}

async function resolveJobName(request: Request): Promise<string | undefined> {
  const fromQuery = new URL(request.url).searchParams.get("job");
  if (fromQuery) return fromQuery;

  const schedule = request.headers.get("x-vercel-cron-schedule");
  if (schedule && SCHEDULE_TO_JOB[schedule]) return SCHEDULE_TO_JOB[schedule];

  if (request.method === "POST") {
    try {
      const body = (await request.json()) as { job?: string };
      return body.job;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

async function run(request: Request): Promise<Response> {
  const denied = authorize(request);
  if (denied) return denied;

  const jobName = await resolveJobName(request);
  if (!jobName || !VALID_JOB_NAMES.includes(jobName as JobName)) {
    return Response.json(
      { error: "Invalid or missing job name", valid: VALID_JOB_NAMES },
      { status: 400 },
    );
  }

  try {
    // Awaited, not fire-and-forget — see file header. runJob() catches errors
    // thrown *inside* the job and returns null; the try here also covers the
    // setup it does before that (db connect, JobRun.create) so a cron call
    // never gets a bodiless 500.
    const result = await runJob(jobName as JobName, JOB_MAP[jobName as JobName]);
    return Response.json(
      { ran: jobName, ok: result !== null, result },
      { status: result !== null ? 200 : 500 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[api/jobs/trigger] ${jobName} crashed before running:`, message);
    return Response.json({ ran: jobName, ok: false, error: message }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
