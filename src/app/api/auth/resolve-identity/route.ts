import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { verifyIdentityProof } from "@/lib/auth-proof";
import { normalizeTarget } from "@/lib/otpUtils";
import { createUserSession } from "@/lib/userSession";

const COOKIE_NAME = "session";
const UINFO_COOKIE_NAME = "uinfo";
const MAX_AGE = 60 * 60 * 24 * 7;

function signJwt(payload: object) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
}

/**
 * POST /api/auth/resolve-identity { method, identifier, fullName?, proof }
 *
 * Real version of july16's mock resolve-identity: requires a valid
 * `auth-proof` token (minted by `/api/auth/verify-magic` or
 * `/api/auth/phone/verify-otp` right after OTP verification — see
 * `lib/auth-proof.ts`) proving this exact identifier was just verified,
 * then looks it up against the real `User` collection.
 *
 *   - matched   → mints a real session (same JWT + cookie pattern as
 *     `/api/auth/login`) and returns `{ matched: true }`.
 *   - no match  → returns `{ matched: false }`; the client hands off into
 *     `onboardingStore` and continues to `/register/details` to finish
 *     creating the account via `/api/auth/complete-profile`.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const method = String(body?.method || "");
    const identifier: string | null = body?.identifier ?? null;
    const fullName: string | undefined = body?.fullName;
    const proof = String(body?.proof || "");

    if (!method || !identifier) {
      return NextResponse.json({ error: "method and identifier are required" }, { status: 400 });
    }

    if (!verifyIdentityProof(proof, method, identifier)) {
      return NextResponse.json({ error: "Identity not verified" }, { status: 401 });
    }

    await dbConnect();

    const isEmail = method === "magic_link" || identifier.includes("@");
    const target = normalizeTarget(isEmail ? "email" : "phone", identifier);
    const query = isEmail ? { email: target } : { primaryNumber: target };

    const user: any = await User.findOne(query).lean();

    if (
      !user ||
      user.isDeleted === true ||
      user.isSuspended === true ||
      user.accountStatus === "Suspended" ||
      user.accountStatus === "Deleted"
    ) {
      return NextResponse.json({ data: { matched: false } });
    }

    const sid = await createUserSession(String(user._id), req);
    const token = signJwt({
      userId: String(user._id),
      email: user.email,
      primaryNumber: user.primaryNumber,
      role: user.role ?? "user",
      sid,
    });

    const res = NextResponse.json({ data: { matched: true } });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    res.cookies.set(
      UINFO_COOKIE_NAME,
      JSON.stringify({ id: String(user._id), ph: user.primaryNumber }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      }
    );

    return res;
  } catch (err: any) {
    console.error("resolve-identity error:", err);
    return NextResponse.json({ error: err?.message || "Something went wrong" }, { status: 500 });
  }
}
