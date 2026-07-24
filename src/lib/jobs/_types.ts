/**
 * lib/jobs/_types.ts
 *
 * Shared types for the batch job runner.
 * Re-exports JobName and JobRunStatus from the model to avoid duplication.
 */

export type { JobName, JobRunStatus } from "@/lib/models/JobRun";

/** Returned by every job function — passed to _runner.ts for logging */
export interface JobResult {
  alertsProcessed: number;
  matchesFound: number;
  emailsSent: number;
  errors: number;
}
