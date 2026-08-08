import connectDB from "@/lib/db";
import User from "@/models/user";

export type VerificationStatus = {
  isEmailVerified: boolean;
  isPrimaryNumberVerified: boolean;
  isFullyVerified: boolean;
};

/**
 * Reads verification flags fresh from the DB — the session JWT doesn't
 * carry them and can be stale. Gates any action that needs a reachable,
 * verified email + phone on both sides (posting ads, chat).
 */
export async function getVerificationStatus(userId: string): Promise<VerificationStatus | null> {
  await connectDB();
  const user = await User.findById(userId).select("isEmailVerified isPrimaryNumberVerified");
  if (!user) return null;

  const isEmailVerified = Boolean(user.isEmailVerified);
  const isPrimaryNumberVerified = Boolean(user.isPrimaryNumberVerified);
  return {
    isEmailVerified,
    isPrimaryNumberVerified,
    isFullyVerified: isEmailVerified && isPrimaryNumberVerified,
  };
}
