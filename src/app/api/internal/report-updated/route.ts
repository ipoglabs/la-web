/**
 * app/api/internal/report-updated/route.ts
 *
 * Called by the back office (lokalads-bo) when staff close an ad report, so
 * the person who reported it hears back (REPORT_TICKET_UPDATED):
 *   actioned  → "Resolved": the ad broke the rules and was dealt with
 *   dismissed → "Dismissed": no breach found
 *
 * The staff note (AdReport.resolution) is internal and is never sent; the
 * reporter gets a fixed, neutral line instead.
 *
 * Auth: `Authorization: Bearer $BO_NOTIFY_SECRET` (see lib/boNotifyAuth.ts).
 * Body: { "reportId": "<Mongo _id>" }. AdReport.reporterNotifiedAt is claimed
 * atomically before sending, so each report is emailed about once.
 *
 * Responses: 200 { sent: true } | 200 { sent: false, skipped } | 401 | 400 |
 * 502 email provider failed (claim released, so a retry can send).
 */

import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import AdReport from "@/components/report-ad/model";
import User from "@/models/user";
import { sendEmail } from "@/lib/email";
import { isEmailMutedUser } from "@/lib/emailMutedUsers";
import { boNotifyAuthorised } from "@/lib/boNotifyAuth";

const json = (body: unknown, status = 200) => Response.json(body, { status });

const OUTCOME = {
  actioned: {
    newStatus: "resolved",
    resolution: "Thank you. We checked the ad, found it broke our rules, and have taken action.",
  },
  dismissed: {
    newStatus: "dismissed",
    resolution: "Thank you. We checked the ad and didn't find a breach of our rules, so it stays up.",
  },
} as const;

export async function POST(req: Request) {
  if (!boNotifyAuthorised(req)) return json({ error: "unauthorised" }, 401);

  const body = (await req.json().catch(() => null)) as { reportId?: unknown } | null;
  const reportId = typeof body?.reportId === "string" ? body.reportId : "";
  if (!mongoose.Types.ObjectId.isValid(reportId)) return json({ error: "reportId required" }, 400);

  await dbConnect();

  const current = await AdReport.findById(reportId).select("status").lean<{ status?: string }>();
  if (!current) return json({ sent: false, skipped: "no such report" });
  const status = current.status as keyof typeof OUTCOME;
  if (!(status in OUTCOME)) return json({ sent: false, skipped: `report is still ${current.status}` });

  const report = await AdReport.findOneAndUpdate(
    { _id: reportId, status, reporterNotifiedAt: { $exists: false } },
    { $set: { reporterNotifiedAt: new Date() } },
    { new: true, projection: { ticketId: 1, reporterEmail: 1, reporterId: 1 } },
  ).lean<{ ticketId: string; reporterEmail?: string | null; reporterId?: string | null }>();
  if (!report) return json({ sent: false, skipped: "reporter already emailed" });

  const release = () => AdReport.updateOne({ _id: reportId }, { $unset: { reporterNotifiedAt: 1 } });

  if (report.reporterId && isEmailMutedUser(report.reporterId)) {
    return json({ sent: false, skipped: "test account (EMAIL_MUTED_USER_IDS)" });
  }

  // A signed-in reporter's current address wins over the one typed in the form.
  let to = report.reporterEmail || "";
  if (report.reporterId && mongoose.Types.ObjectId.isValid(report.reporterId)) {
    const user = await User.findById(report.reporterId)
      .select("email isDeleted")
      .lean<{ email?: string; isDeleted?: boolean }>();
    if (user?.isDeleted) return json({ sent: false, skipped: "reporter's account closed" });
    to = user?.email || to;
  }
  if (!to) {
    await release();
    return json({ sent: false, skipped: "no email address for the reporter" });
  }

  const result = await sendEmail({
    type: "REPORT_TICKET_UPDATED",
    to,
    data: { ticketId: report.ticketId, ...OUTCOME[status] },
  });
  if (!result.success) {
    await release();
    return json({ sent: false, error: "email provider failed" }, 502);
  }
  return json({ sent: true });
}
