/**
 * Admin identity is a fixed allowlist of verified emails — deliberately NOT
 * derived from `User.publicRole`. That field is the self-declared,
 * user-editable "how I participate in the marketplace" identity from
 * config/roles.ts
 * ("zero permission implications" by its own doc comment); overloading it
 * as the admin check meant any account could set role to "admin" via
 * registration (`roleIds` was never validated server-side) or profile edit
 * (the free-text "other" role path) and pass every admin gate in the app.
 *
 * Real admin access now belongs only to this exact, verified mailbox —
 * proven by the normal email OTP login flow (send-otp → verify-magic →
 * resolve-identity), same as any other account. No password, no
 * client-supplied flag.
 */
const ADMIN_EMAILS = new Set(["admin@lokalads.com"]);

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.has(email.trim().toLowerCase());
}
