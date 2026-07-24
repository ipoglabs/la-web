import { NextResponse } from "next/server";
import { verifyOtpService } from "@/lib/otpService";
import { signIdentityProof } from "@/lib/auth-proof";

/**
 * POST /api/auth/phone/verify-otp { phone, otp }
 * Mirrors /api/auth/verify-magic for the phone channel — see that route
 * for the identity-proof rationale.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const phone = String(body?.phone || "").trim();
    const otp = String(body?.otp || "").trim();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and code are required" }, { status: 400 });
    }

    await verifyOtpService({ channel: "phone", value: phone, otp });

    const proof = signIdentityProof("phone_otp", phone);

    return NextResponse.json({ data: { verified: true, proof } });
  } catch (err: any) {
    console.error("phone verify-otp error:", err);
    return NextResponse.json(
      { error: err?.message || "Invalid code" },
      { status: 422 }
    );
  }
}
