import { sendEmail } from "@/lib/email";

interface SendWelcomeEmailArgs {
  fullName: string;
  email: string;
  country?: string;
}

/**
 * Wraps the ACCOUNT_CREATED email event. The real EmailEvent type requires
 * { firstName, country } — this derives firstName from fullName so callers
 * (e.g. the register route) can pass what they already have on the User doc.
 */
export async function sendWelcomeEmail({ fullName, email, country }: SendWelcomeEmailArgs) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  const result = await sendEmail({
    type: "ACCOUNT_CREATED",
    to: email,
    data: {
      firstName,
      country: country || "",
    },
  });

  if (!result.success) {
    // Don't throw — welcome emails shouldn't block registration if delivery
    // fails. Caller (register route) already wraps this in try/catch, but
    // returning quietly here keeps the contract simple either way.
    console.error("[sendWelcomeEmail] failed:", result.error);
  }

  return result;
}