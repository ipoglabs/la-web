"use server";

import dbConnect from "@/lib/db";
import AdReport from "@/components/report-ad/model";
import { requireAdminId } from "@/lib/requireAdmin";

export interface AdminReportedAd {
  ticketId: string;
  adId: string;
  adTitle: string;
  adThumbnail: string;
  sellerName: string;
  location: string;
  issues: string[];
  details: string;
  status: "pending" | "reviewed" | "actioned" | "dismissed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

/** Open report tickets (pending or already-reviewed-but-undecided), highest
 * priority first. Admin-only — enforces the real session check itself,
 * unlike dev-tools's version this replaced (which only sat behind proxy.ts
 * Basic Auth). */
export async function listReportedAds(limit = 200): Promise<AdminReportedAd[]> {
  const adminId = await requireAdminId();
  if (!adminId) return [];

  await dbConnect();

  const priorityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };

  const rows = await AdReport.find({ status: { $in: ["pending", "reviewed"] } })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 500))
    .lean();

  return rows
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    .map((r) => ({
      ticketId: r.ticketId,
      adId: r.adId,
      adTitle: r.adTitle,
      adThumbnail: r.adThumbnail,
      sellerName: r.sellerName,
      location: r.location,
      issues: r.issues,
      details: r.details,
      status: r.status,
      priority: r.priority,
      createdAt: new Date(r.createdAt).toISOString(),
    }));
}
