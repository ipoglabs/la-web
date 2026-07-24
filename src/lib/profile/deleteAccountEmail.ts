import { sendEmail } from "@/lib/email";

interface SendDeleteAccountEmailArgs {
  fullName: string;
  email: string;
  coolOffDays?: number;
  cancelUrl?: string;
}

const DEFAULT_COOL_OFF_DAYS = 30;

/**
 * Wraps the ACCOUNT_DELETION_PENDING email event — used for a soft-delete
 * with a grace period (matches the real User schema's isDeleted/deletedAt/
 * deleteFeedback fields, which read as "pending" deletion rather than an
 * instant hard delete). If your softDeleteAccount action does an immediate,
 * non-reversible delete instead, use the plainer ACCOUNT_DELETED event type
 * from sendEmail directly instead of this wrapper.
 */
export async function sendDeleteAccountEmail({
  fullName,
  email,
  coolOffDays = DEFAULT_COOL_OFF_DAYS,
  cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/account/cancel-deletion`,
}: SendDeleteAccountEmailArgs) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;
  const deletionDate = new Date(
    Date.now() + coolOffDays * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const result = await sendEmail({
    type: "ACCOUNT_DELETION_PENDING",
    to: email,
    data: { firstName, coolOffDays, deletionDate, cancelUrl },
  });

  if (!result.success) {
    console.error("[sendDeleteAccountEmail] failed:", result.error);
  }

  return result;
}