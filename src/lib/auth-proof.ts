/**
 * lib/auth-proof.ts
 *
 * Short-lived, signed "identity proof" tokens — closes the account-
 * enumeration gap flagged in the 2026-07-16 Register+Login architecture
 * audit: `POST /api/auth/resolve-identity` used to accept ANY client-
 * supplied `{ method, identifier }` and answer "does an account exist?"
 * with no proof the caller had actually verified that identifier first.
 *
 * Every identity-proof route (`callback/google`, `callback/apple`,
 * `phone/verify-otp`, `verify-magic`) now mints one of these tokens on
 * success and returns it alongside its existing response data.
 * `resolve-identity` requires and validates one before answering — a
 * request for an identifier the caller never actually verified is
 * rejected outright, rather than silently confirming/denying its
 * existence.
 *
 * POC-scoped: HMAC-signed with `AUTH_PROOF_SECRET` (falls back to a
 * hardcoded dev-only secret with a loud comment below — never rely on
 * that fallback outside local development). 5-minute TTL. This is NOT a
 * session token — it proves nothing beyond "this exact identifier was
 * verified in the last 5 minutes", which is exactly what resolve-identity
 * needs and no more.
 *
 * TODO [INTEGRATION — BEFORE PRODUCTION]: set a real `AUTH_PROOF_SECRET`
 * in every environment (`openssl rand -hex 32`). Once real sessions exist,
 * this whole mechanism can likely be replaced by resolve-identity simply
 * running server-side as part of the same request that verified the OTP/
 * OAuth code, rather than a second round-trip.
 */
import { createHmac, timingSafeEqual } from "crypto";

const FALLBACK_DEV_SECRET = "poc-dev-only-insecure-secret-do-not-use-in-production";
const SECRET = process.env.AUTH_PROOF_SECRET ?? FALLBACK_DEV_SECRET;
const TTL_MS = 5 * 60_000;

interface ProofPayload {
  method: string;
  identifier: string | null;
  exp: number;
}

function sign(payloadB64: string): string {
  return createHmac("sha256", SECRET).update(payloadB64).digest("base64url");
}

/** Mints a proof token for a just-verified `{ method, identifier }` pair. */
export function signIdentityProof(method: string, identifier: string | null): string {
  const payload: ProofPayload = { method, identifier, exp: Date.now() + TTL_MS };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

/** Validates a proof token was minted for exactly this `{ method, identifier }` and hasn't expired. */
export function verifyIdentityProof(
  token: string | null | undefined,
  method: string,
  identifier: string | null
): boolean {
  if (!token) return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;

  const expectedSig = sign(payloadB64);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return false;

  let payload: ProofPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return false;
  }

  if (payload.exp < Date.now()) return false;
  if (payload.method !== method) return false;
  if ((payload.identifier ?? null) !== (identifier ?? null)) return false;
  return true;
}
