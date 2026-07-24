/**
 * lib/jobs/alert-digest.job.ts
 *
 * Daily digest:  runs every day at 08:00  — cron: 0 8 daily
 * Weekly digest: runs every Monday at 08:00 — cron: 0 8 monday
 *
 * Targets alerts with frequency matching the given parameter ("daily" | "weekly").
 * Same match logic as alert-match.job.ts, but batched into one ALERT_DIGEST
 * email per user per alert rather than notifying on every individual match.
 *
 * TODO [scalability]: For large alert collections, replace Alert.find().lean()
 * with cursor-based streaming: Alert.find(...).cursor().eachAsync(fn, { parallel: 10 })
 * to avoid loading all alerts into memory at once.
 */

import dbConnect from "@/lib/db";
import Alert from "@/lib/models/Alert";
import Listing from "@/lib/db/models/Listing";
import { sendEmail } from "@/lib/email";
import type { JobResult } from "@/lib/jobs/_types";
import { escapeRegex } from "@/lib/jobs/_utils";
import mongoose from "mongoose";

const MAX_TRACKED_IDS = 500;

export async function runAlertDigestJob(
  frequency: "daily" | "weekly",
): Promise<JobResult> {
  await dbConnect();

  const result: JobResult = { alertsProcessed: 0, matchesFound: 0, emailsSent: 0, errors: 0 };

  const alerts = await Alert.find({ isActive: true, frequency }).lean();
  result.alertsProcessed = alerts.length;

  for (const alert of alerts) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = {
        status: "live",
        category: alert.category,
        _id: { $nin: alert.lastMatchedListingIds },
      };

      if (alert.subCategory) query.subCategory = alert.subCategory;
      if (alert.location) query.location = { $regex: escapeRegex(alert.location), $options: "i" };
      if (alert.priceMin !== undefined || alert.priceMax !== undefined) {
        query.price = {};
        if (alert.priceMin !== undefined) query.price.$gte = alert.priceMin;
        if (alert.priceMax !== undefined) query.price.$lte = alert.priceMax;
      }
      if (alert.keywords && alert.keywords.length > 0) {
        // OR logic: any keyword present in title OR description triggers a match
        const orPattern = alert.keywords.map((k) => escapeRegex(k)).join("|");
        query.$or = [
          { title: { $regex: orPattern, $options: "i" } },
          { description: { $regex: orPattern, $options: "i" } },
        ];
      }

      const matches = await Listing.find(query).select("_id title").lean();

      if (matches.length === 0) {
        if (!alert.noMatchSince) {
          await Alert.findByIdAndUpdate(alert._id, { $set: { noMatchSince: new Date() } });
        }
        continue;
      }

      result.matchesFound += matches.length;
      const matchIds = matches.map((m) => m._id as mongoose.Types.ObjectId);

      // TODO [auth-integration]: Replace placeholder with real user email lookup:
      //   const user = await User.findById(alert.userId).select("email").lean();
      //   if (!user?.email) { result.errors++; continue; }
      const emailResult = await sendEmail({
        type: "ALERT_DIGEST",
        to: `user-${alert.userId}@placeholder.invalid`,
        data: {
          alertName: alert.name,
          count: matches.length,
          previewUrl: `/listings?alertId=${alert._id}`,
          frequency,
        },
      });

      if (emailResult.success) result.emailsSent++;
      else result.errors++;

      const updatedIds = [...alert.lastMatchedListingIds, ...matchIds].slice(-MAX_TRACKED_IDS);
      await Alert.findByIdAndUpdate(alert._id, {
        $set: { lastMatchedListingIds: updatedIds, lastNotifiedAt: new Date() },
        $unset: { noMatchSince: 1 },
      });
    } catch (err) {
      console.error(`[alert-digest-${frequency}] error processing alert ${alert._id}:`, err);
      result.errors++;
    }
  }

  return result;
}

