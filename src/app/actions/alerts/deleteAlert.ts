"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Alert from "@/models/Alert";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function deleteAlert(alertId: string): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: "Unauthenticated" };

  await connectDB();

  const alert = await Alert.findById(alertId);
  if (!alert) return { ok: false, error: "Alert not found" };
  if (String(alert.userId) !== String(session.userId)) {
    return { ok: false, error: "Not allowed" };
  }

  await Alert.deleteOne({ _id: alertId });
  await logActivity(session.userId, "ALERT_DELETED", { alertId, title: alert.name });

  revalidatePath("/my-alerts");
  return { ok: true };
}
