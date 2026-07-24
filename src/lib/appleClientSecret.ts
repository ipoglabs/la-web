/**
 * lib/appleClientSecret.ts
 *
 * Sign in with Apple doesn't issue a static client secret like Google —
 * NextAuth's Apple provider (node_modules/next-auth/src/providers/apple.ts)
 * requires the caller to hand it a pre-signed JWT instead (its own doc
 * comment points at https://bal.so/apple-gen-secret). This builds that JWT
 * from the 3 pieces Apple gives you when you register a Services ID:
 * Team ID, Key ID, and a private key (.p8 file) — signed ES256 per Apple's
 * spec: https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
 *
 * Needs 4 env vars, none of which are set yet (see AGENTS.md/session notes):
 *   APPLE_ID           — the Services ID you registered, e.g. "com.lokalads.web"
 *   APPLE_TEAM_ID       — 10-char Apple Developer Team ID
 *   APPLE_KEY_ID        — 10-char Key ID for the "Sign in with Apple" key
 *   APPLE_PRIVATE_KEY   — the .p8 file's contents. .env files can't hold
 *                         real newlines in a PEM block, so store it with
 *                         literal "\n" escapes — this unescapes them.
 *
 * TODO [OPERATIONAL]: authOptions.ts calls this once at module load, so the
 * generated JWT (and its `exp`) is fixed for the life of the server
 * process. Fine for how often this app restarts today; revisit (regenerate
 * per-request, or on a timer) if this is ever kept running for the JWT's
 * full ~150-day lifetime uninterrupted.
 */
import jwt from "jsonwebtoken";

export function isAppleConfigured(): boolean {
  return Boolean(
    process.env.APPLE_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY
  );
}

export function generateAppleClientSecret(): string {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = (process.env.APPLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  if (!teamId || !clientId || !keyId || !privateKey) {
    throw new Error("Apple Sign-In is not configured — set APPLE_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY.");
  }

  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: teamId,
      iat: now,
      // Apple allows up to 6 months (15777000s) — 150 days stays safely
      // under that with margin, minimizing how often a restart-triggered
      // regen is actually required (see the TODO above).
      exp: now + 60 * 60 * 24 * 150,
      aud: "https://appleid.apple.com",
      sub: clientId,
    },
    privateKey,
    { algorithm: "ES256", keyid: keyId }
  );
}
