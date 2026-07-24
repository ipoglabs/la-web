import { sendEmail } from "@/lib/email";

interface SendPasswordUpdateEmailArgs {
  fullName: string;
  email: string;
}

export async function sendPasswordUpdateEmail({ fullName, email }: SendPasswordUpdateEmailArgs) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  const result = await sendEmail({
    type: "PROFILE_UPDATED",
    to: email,
    data: { firstName },
  });

  if (!result.success) {
    console.error("[sendPasswordUpdateEmail] failed:", result.error);
  }

  return result;
}
