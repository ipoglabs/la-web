import { sendEmail } from "@/lib/email";

interface SendLocationUpdateEmailArgs {
  fullName: string;
  email: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
}

export async function sendLocationUpdateEmail({
  fullName,
  email,
  changes,
}: SendLocationUpdateEmailArgs) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  const result = await sendEmail({
    type: "PROFILE_UPDATED",
    to: email,
    data: { firstName },
  });

  if (!result.success) {
    console.error("[sendLocationUpdateEmail] failed:", result.error);
  }

  return result;
}
