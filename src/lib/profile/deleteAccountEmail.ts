import { sendEmail } from "@/lib/email";

interface SendDeleteAccountEmailArgs {
  fullName: string;
  email: string;
}

/**
 * Confirms an immediate, final account deletion (ACCOUNT_DELETED) — matches
 * softDeleteAccount, which anonymizes the account right away with no
 * cancellation window.
 */
export async function sendDeleteAccountEmail({
  fullName,
  email,
}: SendDeleteAccountEmailArgs) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  const result = await sendEmail({
    type: "ACCOUNT_DELETED",
    to: email,
    data: { firstName },
  });

  if (!result.success) {
    console.error("[sendDeleteAccountEmail] failed:", result.error);
  }

  return result;
}
