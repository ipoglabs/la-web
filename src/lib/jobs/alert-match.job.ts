/**
 * lib/jobs/alert-match.job.ts
 *
 * Runs every 5 minutes — cron: every-5-min (* /5 * * * *).
 * Targets alerts with frequency = "instant".
 *
 * For each active instant alert:
 *  1. Query live listings that match the alert's criteria
 *  2. Exclude listings already notified for this alert (duplicate guard)
 *  3. If matches found → send ALERT_MATCH email + update alert state
 *  4. If no matches → set noMatchSince (if not already set)
 *
 * Match logic:
 *  - category: required exact match
 *  - subCategory: AND (if set on alert)
 *  - location: AND, case-insensitive contains (if set on alert)
 *  - priceMin / priceMax: AND range (if set on alert)
 *  - keywords: OR — any keyword matches in title OR description (if set on alert)
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

export async function runAlertMatchJob(): Promise<JobResult> {
  await dbConnect();

  const result: JobResult = { alertsProcessed: 0, matchesFound: 0, emailsSent: 0, errors: 0 };

  const alerts = await Alert.find({ isActive: true, frequency: "instant" }).lean();
  result.alertsProcessed = alerts.length;

  for (const alert of alerts) {
    try {
      // Build the Mongoose query for matching live listings
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
        // Track no-match streak start (only set once — preserved until a match clears it)
        if (!alert.noMatchSince) {
          await Alert.findByIdAndUpdate(alert._id, { $set: { noMatchSince: new Date() } });
        }
        continue;
      }

      result.matchesFound += matches.length;
      const matchIds = matches.map((m) => m._id as mongoose.Types.ObjectId);

      // Send notification email — one email per alert regardless of match count
      // TODO [auth-integration]: Replace placeholder with real user email lookup:
      //   const user = await User.findById(alert.userId).select("email").lean();
      //   if (!user?.email) { result.errors++; continue; }
      const emailResult = await sendEmail({
        type: "ALERT_MATCH",
        to: `user-${alert.userId}@placeholder.invalid`,
        data: {
          alertName: alert.name,
          count: matches.length,
          previewUrl: `/listings?alertId=${alert._id}`,
        },
      });

      if (emailResult.success) result.emailsSent++;
      else result.errors++;

      // Update alert: append new match IDs (pruned to last 500), clear noMatchSince, timestamp
      const updatedIds = [...alert.lastMatchedListingIds, ...matchIds].slice(-MAX_TRACKED_IDS);
      await Alert.findByIdAndUpdate(alert._id, {
        $set: { lastMatchedListingIds: updatedIds, lastNotifiedAt: new Date() },
        $unset: { noMatchSince: 1 },
      });
    } catch (err) {
      console.error(`[alert-match] error processing alert ${alert._id}:`, err);
      result.errors++;
    }
  }

  return result;
}

