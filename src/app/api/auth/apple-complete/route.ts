import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { getNextUserId } from "@/lib/sequence";
import { createUserSession } from "@/lib/userSession";

/** Mirrors google-complete/route.ts exactly — see apple-callback/route.ts for the one Apple-specific note (name is effectively always empty). */
const SESSION_COOKIE = "session";
const UINFO_COOKIE = "uinfo";
const PENDING_COOKIE = "apple_pending";
const MAX_AGE = 60 * 60 * 24 * 7;

function requireSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get(PENDING_COOKIE)?.value;

    if (!pendingToken) {
      return NextResponse.json(
        { error: "Apple session expired. Please sign in again." },
        { status: 401 }
      );
    }

    let appleData: { email: string; name: string; image: string };

    try {
      const decoded = jwt.verify(pendingToken, requireSecret()) as any;
      appleData = JSON.parse(decoded.payload);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired Apple session. Please sign in again." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const primaryNumber = String(body.primaryNumber || "").trim();
    const dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
    const locality = String(body.locality || "").trim();

    if (!primaryNumber || !dateOfBirth || isNaN(dateOfBirth.getTime()) || !locality) {
      return NextResponse.json(
        { error: "Phone number, date of birth, and locality are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Race condition guard: user may have been created between callback and now
    const existing = await User.findOne({ email: appleData.email });
    if (existing) {
      const sid = await createUserSession(String(existing._id), req);
      const token = jwt.sign(
        {
          userId: String(existing._id),
          email: existing.email,
          primaryNumber: existing.primaryNumber,
          role: existing.role ?? "user",
          sid,
        },
        requireSecret(),
        { expiresIn: MAX_AGE }
      );

      const res = NextResponse.json({
        message: "Logged in",
        user: {
          id: String(existing._id),
          email: existing.email,
          fullName: existing.fullName,
          primaryNumber: existing.primaryNumber,
          role: existing.role ?? "user",
          locality: existing.locality,
        },
      });

      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      });
      res.cookies.delete(PENDING_COOKIE);
      return res;
    }

    // Check phone uniqueness
    const phoneConflict = await User.findOne({ primaryNumber });
    if (phoneConflict) {
      return NextResponse.json(
        { error: "That phone number is already in use." },
        { status: 409 }
      );
    }

    // Apple users don't use password auth — generate an unusable random hash
    const randomPassword = await hash(crypto.randomBytes(32).toString("hex"), 10);

    const userId = await getNextUserId(12);
    const fullName = appleData.name || "Apple User";

    const created = await User.create({
      userId,
      fullName,
      dateOfBirth,
      email: appleData.email,
      primaryNumber,
      locality,
      password: randomPassword,
      role: "individual",
      provider: "apple",
      image: appleData.image || undefined,
      isEmailVerified: true,
      isPrimaryNumberVerified: false,
      accountStatus: "Active",
      isNewUser: true,
      isTermsAndConditionAccepted: true,
      isPrivacyAndPolicyAccepted: true,
      isCookiesPolicyAccepted: true,
    });

    const sid = await createUserSession(String(created._id), req);
    const token = jwt.sign(
      {
        userId: String(created._id),
        email: created.email,
        primaryNumber: created.primaryNumber,
        role: created.role ?? "user",
        sid,
      },
      requireSecret(),
      { expiresIn: MAX_AGE }
    );

    const res = NextResponse.json(
      {
        message: "Account created",
        user: {
          id: String(created._id),
          email: created.email,
          fullName: created.fullName,
          primaryNumber: created.primaryNumber,
          role: created.role ?? "user",
          locality: created.locality,
        },
      },
      { status: 201 }
    );

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });

    res.cookies.set(
      UINFO_COOKIE,
      JSON.stringify({ id: String(created._id), ph: created.primaryNumber }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      }
    );

    res.cookies.delete(PENDING_COOKIE);

    return res;
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return NextResponse.json(
        { error: `That ${field} is already in use.` },
        { status: 409 }
      );
    }
    console.error("Apple complete error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
