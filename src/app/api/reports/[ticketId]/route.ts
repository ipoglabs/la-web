/**
 * app/api/reports/[ticketId]/route.ts
 *
 * GET /api/reports/:ticketId — fetch report status by ticket ID
 *
 * Guest reports (reporterId === null) remain readable by anyone who knows the
 * ticket ID — the ticket ID itself acts as a bearer token, same model as a
 * courier tracking number. Reports filed by a logged-in user (reporterId set)
 * additionally require the requester's session to match that reporterId.
 *
 * Responses:
 *   200 { ticketId, status, priority, createdAt }
 *   403 { error }   — ticket belongs to a different logged-in reporter
 *   404 { error }   — ticket not found
 *   500 { error }   — unexpected server error
 *
 * Reviewing reports (the old admin PATCH) moved to the back office
 * (lokalads-bo), which audit-logs every decision and emails the reporter
 * through /api/internal/report-updated.
 */

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdReport from "@/components/report-ad/model";
import { getAuthUser } from "@/lib/session";

// ── GET ────────────────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  try {
    const { ticketId } = await params;

    await dbConnect();

    const report = await AdReport
      .findOne({ ticketId })
      .select("ticketId status priority createdAt reporterId")
      .lean();

    if (!report) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (report.reporterId) {
      const session = await getAuthUser();
      if (session?.id !== report.reporterId) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({
      ticketId:  report.ticketId,
      status:    report.status,
      priority:  report.priority,
      createdAt: report.createdAt,
    });
  } catch (err) {
    console.error("[GET /api/reports/:ticketId]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
