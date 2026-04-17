"use server";

import { getSession } from "@/lib/auth";
import { verifyOtpService } from "@/lib/otpService";

export async function verifyOtp(data: {
  channel: "email" | "phone";
  value: string;
  otp: string;
}) {
  const session = await getSession();

  if (!data?.value || !data?.otp) {
    throw new Error("Invalid request");
  }

  await verifyOtpService({
    userId: session?.userId,
    channel: data.channel,
    value: data.value,
    otp: data.otp,
  });

  return { success: true };
}