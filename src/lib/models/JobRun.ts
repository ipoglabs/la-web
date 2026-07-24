/**
 * lib/models/JobRun.ts
 *
 * Mongoose model for batch job execution logs.
 * Every cron job writes a start record here and updates it on completion/failure.
 * Used for health monitoring and debugging.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export type JobName =
  | "alert-match"
  | "alert-digest-daily"
  | "alert-digest-weekly"
  | "alert-no-match";

export type JobRunStatus = "running" | "completed" | "failed";

export interface IJobRunStats {
  alertsProcessed: number;
  matchesFound: number;
  emailsSent: number;
  errors: number;
}

export interface IJobRun extends Document {
  jobName: JobName;
  startedAt: Date;
  completedAt?: Date;
  status: JobRunStatus;
  stats: IJobRunStats;
  error?: string;
}

const JobRunSchema = new Schema<IJobRun>(
  {
    jobName: {
      type: String,
      required: true,
      enum: ["alert-match", "alert-digest-daily", "alert-digest-weekly", "alert-no-match"],
      index: true,
    },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ["running", "completed", "failed"],
      default: "running",
      index: true,
    },
    stats: {
      alertsProcessed: { type: Number, default: 0 },
      matchesFound: { type: Number, default: 0 },
      emailsSent: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
    error: { type: String },
  },
  { timestamps: false },  // startedAt/completedAt are explicit — no auto timestamps needed
);

// Keep recent job runs queryable by name + date for health dashboards
JobRunSchema.index({ jobName: 1, startedAt: -1 });

const JobRun: Model<IJobRun> =
  mongoose.models.JobRun ?? mongoose.model<IJobRun>("JobRun", JobRunSchema);

export default JobRun;
