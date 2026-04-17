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

  await sendOtpService({
    userId: session?.userId,
    channel: data.channel,
    value: data.value,
  });

  return { success: true };
}