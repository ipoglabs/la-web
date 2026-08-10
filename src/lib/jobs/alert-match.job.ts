/**
 * lib/jobs/alert-match.job.ts
 *
 * Runs every 5 minutes — cron: every-5-min (* /5 * * * *).
 * Targets alerts with frequency = "instant".
 *
 * For each active instant alert:
 *  1. Query live Posts that match the alert's criteria
 *  2. Exclude posts already notified for this alert (duplicate guard)
 *  3. If matches found → send ALERT_MATCH email + update alert state
 *  4. If no matches → set noMatchSince (if not already set)
 *
 * Match logic (see findAlertMatches in _utils.ts):
 *  - category: required, id-or-label match
 *  - subCategory: AND, id-or-label match (if set on alert)
 *  - location: AND, case-insensitive contains on location.address (if set)
 *  - priceMin / priceMax: AND range (if set on alert)
 *  - keywords: OR — any keyword matches in name OR description (if set)
 *
 * TODO [scalability]: For large alert collections, replace Alert.find().lean()
 * with cursor-based streaming: Alert.find(...).cursor().eachAsync(fn, { parallel: 10 })
 * to avoid loading all alerts into memory at once.
 */

import dbConnect from "@/lib/db";
import Alert from "@/models/Alert";
import { sendEmail } from "@/lib/email";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import type { JobResult } from "@/lib/jobs/_types";
import { findAlertMatches, getAlertRecipient } from "@/lib/jobs/_utils";

const MAX_TRACKED_IDS = 500;

export async function runAlertMatchJob(): Promise<JobResult> {
  await dbConnect();

  const result: JobResult = { alertsProcessed: 0, matchesFound: 0, emailsSent: 0, whatsappSent: 0, errors: 0 };

  const alerts = await Alert.find({ isActive: true, frequency: "instant" }).lean();
  result.alertsProcessed = alerts.length;

  for (const alert of alerts) {
    try {
      const matches = await findAlertMatches(alert);

      if (matches.length === 0) {
        // Track no-match streak start (only set once — preserved until a match clears it)
        if (!alert.noMatchSince) {
          await Alert.findByIdAndUpdate(alert._id, { $set: { noMatchSince: new Date() } });
        }
        continue;
      }

      result.matchesFound += matches.length;
      const matchIds = matches.map((m) => m._id);

      const recipient = await getAlertRecipient(alert.userId);
      if (!recipient.email && !recipient.phone) {
        result.errors++;
        continue;
      }

      // Send notification email — one email per alert regardless of match count
      if (alert.notifyVia.includes("email") && recipient.email) {
        const emailResult = await sendEmail({
          type: "ALERT_MATCH",
          to: recipient.email,
          data: {
            alertName: alert.name,
            count: matches.length,
            previewUrl: `/listings?alertId=${alert._id}`,
          },
        });

        if (emailResult.success) result.emailsSent++;
        else result.errors++;
      }

      // WhatsApp — only ever to a verified primaryNumber, never an unverified one
      if (alert.notifyVia.includes("whatsapp") && recipient.phone && recipient.isPhoneVerified) {
        const matchWord = matches.length === 1 ? "match" : "matches";
        const sent = await sendWhatsAppMessage(
          recipient.phone,
          `LokalAds: ${matches.length} new ${matchWord} for your "${alert.name}" alert. View: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://lokalads.com"}/listings?alertId=${alert._id}`,
        );
        if (sent) result.whatsappSent++;
        else result.errors++;
      }

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

