import mongoose from "mongoose";

/**
 * Accounts whose posts must not trigger email — for test runs on production.
 * Set EMAIL_MUTED_USER_IDS to a comma-separated list of User _ids. Their posts
 * skip the "listing live" email and the admin option-request email, and saved
 * alerts never match them (so no real user is emailed about a test post).
 * Every other email (login, chat, account) is unaffected. Unset = no effect.
 */
export function emailMutedUserIds(): string[] {
  return (process.env.EMAIL_MUTED_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => mongoose.Types.ObjectId.isValid(s));
}

export function isEmailMutedUser(userId: unknown): boolean {
  return userId != null && emailMutedUserIds().includes(String(userId));
}
