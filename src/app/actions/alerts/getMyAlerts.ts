"use server";

import connectDB from "@/lib/db";
import Alert from "@/models/Alert";
import { getSession } from "@/lib/auth";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";

export type MyAlertRow = {
  id: string;
  name: string;
  categoryLabel: string;
  subCategoryLabel?: string;
  keywords: string[];
  location?: string;
  priceMin?: number;
  priceMax?: number;
  frequency: "instant" | "daily" | "weekly";
  notifyVia: string[];
  isActive: boolean;
  lastNotifiedAt?: string;
  noMatchSince?: string;
  createdAt: string;
};

/** The current user's saved-search alerts, newest first — powers /my-alerts. */
export async function getMyAlerts(): Promise<MyAlertRow[]> {
  const session = await getSession();
  if (!session?.userId) return [];

  await connectDB();

  const alerts = await Alert.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  return alerts.map((a) => ({
    id: String(a._id),
    name: a.name,
    categoryLabel: CATEGORY_LABELS[a.category] ?? a.category,
    subCategoryLabel: a.subCategory
      ? SUBCATEGORY_LABELS[a.category]?.[a.subCategory] ?? a.subCategory
      : undefined,
    keywords: a.keywords ?? [],
    location: a.location,
    priceMin: a.priceMin,
    priceMax: a.priceMax,
    frequency: a.frequency,
    notifyVia: a.notifyVia ?? [],
    isActive: a.isActive,
    lastNotifiedAt: a.lastNotifiedAt ? new Date(a.lastNotifiedAt).toISOString() : undefined,
    noMatchSince: a.noMatchSince ? new Date(a.noMatchSince).toISOString() : undefined,
    createdAt: new Date(a.createdAt).toISOString(),
  }));
}
