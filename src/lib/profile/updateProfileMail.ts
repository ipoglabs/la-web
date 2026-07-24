import { sendEmail } from "@/lib/email";

interface SendProfileUpdateEmailArgs {
  fullName: string;
  email: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
}

export async function sendProfileUpdateEmail({ fullName, email }: SendProfileUpdateEmailArgs) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  const result = await sendEmail({
    type: "PROFILE_UPDATED",
    to: email,
    data: { firstName },
  });

  if (!result.success) {
    console.error("[sendProfileUpdateEmail] failed:", result.error);
  }

  return result;
}