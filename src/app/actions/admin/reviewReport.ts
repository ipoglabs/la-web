"use server";

import { requireAdminId } from "@/lib/requireAdmin";
import { reviewReport, type ReportDecision } from "@/lib/moderation";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function reviewReportAction(
  ticketId: string,
  decision: ReportDecision,
  resolution?: string
): Promise<ActionResult> {
  const adminId = await requireAdminId();
  if (!adminId) return { ok: false, error: "forbidden" };
  try {
    await reviewReport({ ticketId, decision, resolution, adminId });
    return { ok: true };
  } catch {
    return { ok: false, error: "failed" };
  }
}
