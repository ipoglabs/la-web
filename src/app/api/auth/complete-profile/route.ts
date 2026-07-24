import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { getNextUserId } from "@/lib/sequence";
import { verifyIdentityProof } from "@/lib/auth-proof";
import { normalizeTarget } from "@/lib/otpUtils";
import { sendWelcomeEmail } from "@/lib/sendWelcomeEmail";
import { createUserSession } from "@/lib/userSession";
import { BASE_ROLE, type RoleId } from "@/config/roles";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7;

function signJwt(payload: object) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
}

/**
 * POST /api/auth/complete-profile
 * { method, identifier, fullName, gender, dateOfBirthIso, roleIds, specialties, customRole }
 *
 * Real account creation for the passwordless Register journey (final
 * step, called by RoleStep's Skip/Continue). Requires a valid
 * `auth-proof` token proving `identifier` was actually verified via OTP
 * (magic_link/phone_otp) in this same journey — google/apple accounts are
 * created by the existing real `/api/auth/google-callback` +
 * `/register/google-complete` flow instead and never reach this route.
 *
 * Per the schema migration agreed for this port: email and primaryNumber
 * are each optional+sparse (one is required, enforced by the model's
 * pre-validate hook) and password is optional — this flow never sets one.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const method = String(body?.method || "");
    const identifier: string | null = body?.identifier ?? null;
    const fullName = String(body?.fullName || "").trim();
    const gender = String(body?.gender || "").trim();
    const dateOfBirthIso = String(body?.dateOfBirthIso || "");
    const roleIds: RoleId[] = Array.isArray(body?.roleIds) ? body.roleIds : [];
    const specialties = body?.specialties && typeof body.specialties === "object" ? body.specialties : {};
    const customRole: string | null = body?.customRole ?? null;

    if (method !== "magic_link" && method !== "phone_otp") {
      return NextResponse.json({ error: "Unsupported method for this route" }, { status: 400 });
    }
    if (!identifier || !fullName || !dateOfBirthIso) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const proof = String(body?.proof || "");
    if (!verifyIdentityProof(proof, method, identifier)) {
      return NextResponse.json({ error: "Identity not verified" }, { status: 401 });
    }

    await dbConnect();

    const isEmail = method === "magic_link";
    const target = normalizeTarget(isEmail ? "email" : "phone", identifier);

    const dup = await User.findOne({
      ...(isEmail ? { email: target } : { primaryNumber: target }),
      accountStatus: { $nin: ["Deleted"] },
    });
    if (dup) {
      return NextResponse.json(
        { error: `An account with that ${isEmail ? "email" : "phone number"} already exists.` },
        { status: 409 }
      );
    }

    const userId = await getNextUserId(12);
    const primaryRole = roleIds[0] ?? BASE_ROLE.id;

    const created = await User.create({
      userId,
      fullName,
      dateOfBirth: new Date(dateOfBirthIso),
      gender: gender || undefined,
      ...(isEmail ? { email: target, isEmailVerified: true } : { primaryNumber: target, isPrimaryNumberVerified: true }),
      role: primaryRole,
      roles: roleIds,
      roleSpecialties: specialties,
      customRole: customRole || undefined,
      provider: "credentials",
      accountStatus: "Active",
      isNewUser: true,
      isTermsAndConditionAccepted: true,
    });

    if (created.email) {
      try {
        await sendWelcomeEmail({ fullName: created.fullName, email: created.email });
      } catch (err) {
        console.error("Welcome email failed:", err);
      }
    }

    const sid = await createUserSession(String(created._id), req);
    const token = signJwt({
      userId: String(created._id),
      email: created.email,
      primaryNumber: created.primaryNumber,
      role: created.role ?? "user",
      sid,
    });

    const res = NextResponse.json({ data: { id: String(created._id) } }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });

    return res;
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return NextResponse.json({ error: `That ${field} is already in use.` }, { status: 409 });
    }
    console.error("complete-profile error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create account" }, { status: 500 });
  }
}
