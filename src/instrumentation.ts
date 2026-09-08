/**
 * instrumentation.ts
 *
 * Next.js startup hook — runs once when the server process starts.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * The NEXT_RUNTIME guard is required: this file runs in both Node.js and Edge
 * runtimes. node-cron only works in Node.js — skip it in Edge.
 *
 * The try/catch is required: if MONGODB_URI is missing, lib/db.ts throws at
 * module load time inside the dynamic import. Without a catch, that crash
 * propagates and prevents Next.js from starting. Instead we log a warning and
 * continue — the app works with mock data, jobs just won't run.
 */

export async function register() {
  // On Vercel, jobs are driven by vercel.json `crons` hitting
  // /api/jobs/trigger — the serverless runtime has no long-lived process for
  // node-cron's in-memory timers to survive in. Everywhere else (local dev,
  // self-hosted) node-cron is the scheduler. The `!VERCEL` guard stops the
  // two schedulers from double-firing every job in production.
  if (process.env.NEXT_RUNTIME === "nodejs" && !process.env.VERCEL) {
    try {
      const { initJobRunner } = await import("@/lib/jobs/index");
      initJobRunner();
    } catch (err) {
      // Jobs will not run — check MONGODB_URI in .env.local
      console.warn(
        "[jobs] scheduler not started:",
        err instanceof Error ? err.message : String(err),
      );
    }
  }
}

