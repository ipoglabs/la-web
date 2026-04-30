import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { getNextUserId } from "@/lib/sequence";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "@/lib/sendWelcomeEmail";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function stripEmpty(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
}

function toNameCase(input: string) {
  return String(input || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function signJwt(payload: object) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // ✅ New structured fields
    const address = stripEmpty({
      street1: body.street1 ? String(body.street1).trim() : undefined,
      street2: body.street2 ? String(body.street2).trim() : undefined,
      district: body.district ? String(body.district).trim() : undefined,
      state: body.state ? String(body.state).trim() : undefined,
      country: body.country ? String(body.country).trim() : undefined,
      postalCode: body.postalCode ? String(body.postalCode).trim() : undefined,
    });

    const audit = stripEmpty({
      IPAddress:
        String(req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").trim() ||
        undefined,
      Device: String(req.headers.get("user-agent") || "").trim() || undefined,
      others: body.auditOthers ? String(body.auditOthers).trim() : undefined,
    });

    const payload = stripEmpty({
      firstName: toNameCase(body.firstName),
      lastName: toNameCase(body.lastName),
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: String(body.gender || "other").trim(),

      nationality: body.nationality ? String(body.nationality).trim() : undefined,
      residence: body.residence ? String(body.residence).trim() : undefined,

      locality: String(body.locality || "").trim(),
      email: String(body.email || "").trim().toLowerCase(),

      primaryNumber: String(body.primaryNumber || "").trim(),

      password: String(body.password || ""),
      role: String(body.role || "individual").trim(),

      // ✅ Consents
      isTermsAndConditionAccepted: !!body.isTermsAndConditionAccepted,
      isPrivacyAndPolicyAccepted: !!body.isPrivacyAndPolicyAccepted,
      isCookiesPolicyAccepted: !!body.isCookiesPolicyAccepted,

      // ✅ Marketing
      marketingOptIn: !!body.subscribe,
    });

    // required
    const missing: string[] = [];
    if (!payload.firstName) missing.push("firstName");
    if (!payload.lastName) missing.push("lastName");
    if (!payload.dateOfBirth) missing.push("dateOfBirth");
    if (!payload.email) missing.push("email");
    if (!payload.primaryNumber) missing.push("primaryNumber");
    if (!payload.locality) missing.push("locality");
    if (!payload.password) missing.push("password");

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // duplicate check (ONLY block active users)
const dup = await User.findOne({
  $and: [
    {
      $or: [
        { email: payload.email },
        { primaryNumber: payload.primaryNumber },
      ],
    },
    {
      accountStatus: { $nin: ["Deleted"] }, // 🔥 ONLY THIS IS NEEDED
    },
  ],
})
  .select("email primaryNumber accountStatus")
  .lean();

if (dup) {
  if (dup.email === payload.email) {
    return NextResponse.json(
      { error: "That email is already in use." },
      { status: 409 }
    );
  }

  if (dup.primaryNumber === payload.primaryNumber) {
    return NextResponse.json(
      { error: "That phone number is already in use." },
      { status: 409 }
    );
  }
}

    // ✅ generate incremental userId
    const userId = await getNextUserId(12);
    const passwordHash = await hash(payload.password, 10);

    const created = await User.create({
      ...payload,
      userId,
      password: passwordHash,

      // ✅ Save structured address + audit only if present
      ...(Object.keys(address).length ? { address } : {}),
      ...(Object.keys(audit).length ? { audit } : {}),

      // ✅ status fields
      accountStatus: "Pending",
      isNewUser: true,

      // ✅ verification
      isEmailVerified: true,
      isPrimaryNumberVerified: true,

      // legacy field (keep for backward compat)
      isPhoneVerified: true,

      provider: "credentials",
    });

    // welcome email (don't await, we don't want to block the response if email fails)
sendWelcomeEmail({
  firstName: created.firstName,
  lastName: created.lastName,
  email: created.email,
  phone: created.primaryNumber,
}).catch((err) => {
  console.error("Welcome email failed:", err);
});

    const token = signJwt({
      userId: String(created._id),
      email: created.email,
      role: created.role ?? "user",
    });

    const res = NextResponse.json(
      {
        message: "Registered successfully",
        user: {
          id: String(created._id),
          userId: created.userId,
          email: created.email,
          firstName: created.firstName,
          lastName: created.lastName,
          primaryNumber: created.primaryNumber,
          role: created.role ?? "user",
          locality: created.locality,
          accountStatus: created.accountStatus,
        },
        token,
      },
      { status: 201 }
    );

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
    console.error("Register error:", err);
    return NextResponse.json({ error: err?.message || "Registration failed" }, { status: 500 });
  }
}
