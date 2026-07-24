"use server";

import { getSession } from "@/lib/auth";
import { sendOtpService } from "@/lib/otpService";

export async function sendOtp(data: {
  channel: "email" | "phone";
  value: string;
}) {
  const session = await getSession();

  if (!data?.value) {
    throw new Error("Value is required");
  }

  const result = await sendOtpService({
    userId: session?.userId,
    channel: data.channel,
    value: data.value,
  });

  // devCode is only ever present for phone OTPs outside production (see
  // otpService.ts) — surfaced so the UI can display it in place of a real
  // SMS until an SMS provider is wired up.
  return { success: true, devCode: (result as { devCode?: string }).devCode };
}