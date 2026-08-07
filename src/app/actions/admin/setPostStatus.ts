"use server";

import { requireAdminId } from "@/lib/requireAdmin";
import { setPostStatus, type PostStatusTarget } from "@/lib/moderation";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function setPostStatusAction(
  postId: string,
  target: PostStatusTarget,
  reason?: string
): Promise<ActionResult> {
  const adminId = await requireAdminId();
  if (!adminId) return { ok: false, error: "forbidden" };
  try {
    await setPostStatus({ postId, adminId, target, reason });
    return { ok: true };
  } catch {
    return { ok: false, error: "failed" };
  }
}
