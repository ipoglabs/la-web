"use server";

import { getSession } from "@/lib/auth";
import { getVerificationStatus } from "@/lib/verification";

export type NotifyChannelAvailability = {
  emailAvailable: boolean;
  whatsappAvailable: boolean;
};

/**
 * Whether the current user can actually receive alert notifications on
 * each channel — powers the Email/WhatsApp toggle gating in Step 3 of
 * CreateAlertJourney. A channel is only "available" once the underlying
 * contact (email / primaryNumber) is verified, since the batch jobs
 * (lib/jobs/*.job.ts) only ever send to a verified address/number.
 */
export async function getNotifyChannelAvailability(): Promise<NotifyChannelAvailability> {
  const session = await getSession();
  if (!session?.userId) return { emailAvailable: false, whatsappAvailable: false };

  const status = await getVerificationStatus(session.userId);
  return {
    emailAvailable: Boolean(status?.isEmailVerified),
    whatsappAvailable: Boolean(status?.isPrimaryNumberVerified),
  };
}
