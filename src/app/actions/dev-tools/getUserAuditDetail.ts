"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import User from "@/models/user";
import Alert from "@/models/Alert";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";

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

  // Enrich ALERT_CREATED rows with the alert's actual search criteria —
  // metadata only ever stored {alertId, title}, which shows the alert's
  // name but not what it's watching for. Batched lookup; gracefully no-ops
  // for alerts since deleted (ALERT_DELETED's own metadata already has no
  // live alert to join against, so it's intentionally left alone here).
  const alertIds = entries
    .filter((e) => e.action === "ALERT_CREATED" && typeof e.metadata?.alertId === "string")
    .map((e) => e.metadata!.alertId as string)
    .filter((id) => Types.ObjectId.isValid(id));

  const alertCriteriaById = new Map<string, string>();
  if (alertIds.length > 0) {
    const alerts = await Alert.find({ _id: { $in: alertIds } })
      .select("category subCategory location priceMin priceMax keywords")
      .lean();
    for (const a of alerts) {
      const categoryLabel = CATEGORY_LABELS[a.category] ?? a.category;
      const subCategoryLabel = a.subCategory
        ? (SUBCATEGORY_LABELS[a.category]?.[a.subCategory] ?? a.subCategory)
        : undefined;
      const parts = [subCategoryLabel ? `${categoryLabel} - ${subCategoryLabel}` : categoryLabel];
      if (a.location) parts.push(a.location);
      if (a.priceMin != null || a.priceMax != null) {
        parts.push(
          a.priceMin != null && a.priceMax != null
            ? `₹${a.priceMin}–₹${a.priceMax}`
            : a.priceMin != null
              ? `from ₹${a.priceMin}`
              : `up to ₹${a.priceMax}`
        );
      }
      if (a.keywords?.length) parts.push(`"${a.keywords.join(", ")}"`);
      alertCriteriaById.set(String(a._id), parts.join(" · "));
    }
  }

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
    entries: entries.map((e) => {
      const alertId = e.metadata?.alertId;
      const criteria =
        e.action === "ALERT_CREATED" && typeof alertId === "string"
          ? alertCriteriaById.get(alertId)
          : undefined;
      return {
        id: String(e._id),
        action: e.action,
        metadata: criteria ? { ...e.metadata, criteria } : e.metadata,
        at: new Date(e.createdAt).toISOString(),
        actor: e.actorId ? { id: String(e.actorId._id), fullName: e.actorId.fullName } : null,
      };
    }),
  };
}
