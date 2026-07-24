import { NextResponse } from "next/server";
import { verifyOtpService } from "@/lib/otpService";
import { signIdentityProof } from "@/lib/auth-proof";

/**
 * POST /api/auth/verify-magic { email, otp }
 *
 * Real verification against the Mongo-backed OTP record (same
 * `otpService` used elsewhere). On success mints a short-lived
 * `auth-proof` token — see `lib/auth-proof.ts` — so a subsequent call to
 * `/api/auth/resolve-identity` can prove this exact identifier was just
 * verified, without re-running OTP verification a second time.
 *
 * Returns 422 specifically for a wrong/expired/locked code (matches the
 * client's `res.status === 422` branch, distinct from a network/500 error).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const email = String(body?.email || "").trim().toLowerCase();
    const otp = String(body?.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    await verifyOtpService({ channel: "email", value: email, otp });

    const proof = signIdentityProof("magic_link", email);

    return NextResponse.json({ data: { verified: true, proof } });
  } catch (err: any) {
    console.error("verify-magic error:", err);
    return NextResponse.json(
      { error: err?.message || "Invalid code" },
      { status: 422 }
    );
  }
}
