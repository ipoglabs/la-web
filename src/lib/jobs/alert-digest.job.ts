/**
 * lib/jobs/alert-digest.job.ts
 *
 * Daily digest:  runs every day at 08:00  — cron: 0 8 daily
 * Weekly digest: runs every Monday at 08:00 — cron: 0 8 monday
 *
 * Targets alerts with frequency matching the given parameter ("daily" | "weekly").
 * Same match logic as alert-match.job.ts (findAlertMatches in _utils.ts),
 * but batched into one ALERT_DIGEST email per user per alert rather than
 * notifying on every individual match.
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

export async function runAlertDigestJob(
  frequency: "daily" | "weekly",
): Promise<JobResult> {
  await dbConnect();

  const result: JobResult = { alertsProcessed: 0, matchesFound: 0, emailsSent: 0, whatsappSent: 0, errors: 0 };

  const alerts = await Alert.find({ isActive: true, frequency }).lean();
  result.alertsProcessed = alerts.length;

  for (const alert of alerts) {
    try {
      const matches = await findAlertMatches(alert);

      if (matches.length === 0) {
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

      if (alert.notifyVia.includes("email") && recipient.email) {
        const emailResult = await sendEmail({
          type: "ALERT_DIGEST",
          to: recipient.email,
          data: {
            alertName: alert.name,
            count: matches.length,
            previewUrl: `/listings?alertId=${alert._id}`,
            frequency,
          },
        });

        if (emailResult.success) result.emailsSent++;
        else result.errors++;
      }

      if (alert.notifyVia.includes("whatsapp") && recipient.phone && recipient.isPhoneVerified) {
        const matchWord = matches.length === 1 ? "match" : "matches";
        const sent = await sendWhatsAppMessage(
          recipient.phone,
          `Your ${frequency} digest — ${matches.length} new ${matchWord} for "${alert.name}"`,
          `${process.env.NEXT_PUBLIC_APP_URL ?? "https://lokalads.com"}/listings?alertId=${alert._id}`,
        );
        if (sent) result.whatsappSent++;
        else result.errors++;
      }

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

