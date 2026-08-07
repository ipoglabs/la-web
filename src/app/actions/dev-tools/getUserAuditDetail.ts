"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import User from "@/models/user";

export type AuditRange = "24h" | "7d" | "30d" | "all";

export interface DevToolsAuditEntry {
  id: string;
  action: string;
  metadata?: Record<string, unknown>;
  at: string;
  actor?: { id: string; fullName: string } | null;
}

export interface DevToolsAuditUser {
  id: string;
  uuid: string;
  fullName: string;
  publicRole: string;
  roleTitle?: string;
  roleDescription?: string;
  customRole?: string | null;
}

export interface DevToolsAuditDetail {
  user: DevToolsAuditUser | null;
  entries: DevToolsAuditEntry[];
}

const RANGE_MS: Record<Exclude<AuditRange, "all">, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

/**
 * Per-user audit detail for dev-tools's Audit History tab — Basic-Auth gated,
 * see src/app/dev-tools/page.tsx. Explicitly opts into the internal `uuid`
 * (`select: false` on the schema, see models/user.ts) since this dev tool
 * is one of the few sanctioned places allowed to see it — never exposed to
 * the end user themselves.
 */
export async function getUserAuditDetail(
  userId: string,
  range: AuditRange = "7d"
): Promise<DevToolsAuditDetail> {
  if (!Types.ObjectId.isValid(userId)) return { user: null, entries: [] };
  await dbConnect();

  const uid = new Types.ObjectId(userId);

  const user = await User.findById(uid)
    .select("+uuid fullName publicRole roleTitle roleDescription customRole")
    .lean<{
      _id: Types.ObjectId;
      uuid: string;
      fullName: string;
      publicRole: string;
      roleTitle?: string;
      roleDescription?: string;
      customRole?: string;
    }>();

  if (!user) return { user: null, entries: [] };

  const query: Record<string, unknown> = { userId: uid };
  if (range !== "all") {
    query.createdAt = { $gte: new Date(Date.now() - RANGE_MS[range]) };
  }

  const entries = await ActivityLog.find(query)
    .sort({ createdAt: -1 })
    .limit(500)
    .populate<{ actorId: { _id: Types.ObjectId; fullName: string } | null }>("actorId", "fullName")
    .lean<
      {
        _id: unknown;
        action: string;
        metadata?: Record<string, unknown>;
        createdAt: Date;
        actorId?: { _id: Types.ObjectId; fullName: string } | null;
      }[]
    >();

  return {
    user: {
      id: String(user._id),
      uuid: user.uuid,
      fullName: user.fullName,
      publicRole: user.publicRole,
      roleTitle: user.roleTitle,
      roleDescription: user.roleDescription,
      customRole: user.customRole,
    },
    entries: entries.map((e) => ({
      id: String(e._id),
      action: e.action,
      metadata: e.metadata,
      at: new Date(e.createdAt).toISOString(),
      actor: e.actorId ? { id: String(e.actorId._id), fullName: e.actorId.fullName } : null,
    })),
  };
}
