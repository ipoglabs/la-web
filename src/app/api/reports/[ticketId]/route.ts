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
 * PATCH /api/reports/:ticketId — admin: update status + resolution
 *
 * Request body: { status: string; resolution?: string }
 *
 * Responses:
 *   200 { ticketId, status, reviewedAt }
 *   400 { error }   — invalid status value
 *   401 { error }   — not logged in
 *   403 { error }   — logged in but not an admin
 *   404 { error }   — ticket not found
 *   500 { error }   — unexpected server error
 */

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdReport from "@/components/report-ad/model";
import { getSession } from "@/lib/session";

const VALID_STATUSES = ["pending", "reviewed", "actioned", "dismissed"] as const;

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
      const session = await getSession();
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

// ── PATCH (admin) ──────────────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { ticketId } = await params;

    const body = await req.json().catch(() => null);
    if (!body || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: "validation_error", message: `status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 },
      );
    }

    await dbConnect();

    const report = await AdReport.findOneAndUpdate(
      { ticketId },
      {
        status:     body.status,
        resolution: body.resolution ?? null,
        reviewedAt: new Date(),
        reviewedBy: session.id,
      },
      { new: true, select: "ticketId status reviewedAt" },
    );

    if (!report) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      ticketId:   report.ticketId,
      status:     report.status,
      reviewedAt: report.reviewedAt,
    });
  } catch (err) {
    console.error("[PATCH /api/reports/:ticketId]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
