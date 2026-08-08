"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Alert from "@/models/Alert";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function toggleAlertActive(
  alertId: string,
  isActive: boolean
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: "Unauthenticated" };

  await connectDB();

  const alert = await Alert.findById(alertId);
  if (!alert) return { ok: false, error: "Alert not found" };
  if (String(alert.userId) !== String(session.userId)) {
    return { ok: false, error: "Not allowed" };
  }

  alert.isActive = isActive;
  await alert.save();

  await logActivity(session.userId, "ALERT_STATUS_CHANGED", {
    alertId,
    title: alert.name,
    from: isActive ? "paused" : "active",
    to: isActive ? "active" : "paused",
  });

  revalidatePath("/my-alerts");
  return { ok: true };
}
