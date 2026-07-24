import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
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

    // NOTE: street1/street2/district removed from here — they were being
    // collected and validated but AddressSchema on the real User model only
    // defines { country, state, city, postalCode }, so they were silently
    // dropped by Mongoose's strict mode on save. Add them back once
    // AddressSchema is extended to include them (see the accompanying
    // user.ts patch), or leave removed if that was leftover from an older
    // address form.
    const address = stripEmpty({
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
      fullName: toNameCase(body.fullName),
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: String(body.gender || "other").trim(),

      nationality: body.nationality ? String(body.nationality).trim() : undefined,
      residency: body.residency ? String(body.residency).trim() : undefined,

      locality: String(body.locality || "").trim(),
      email: String(body.email || "").trim().toLowerCase(),

      primaryNumber: String(body.primaryNumber || "").trim(),
      secondaryNumber1: body.secondaryNumber1 ? String(body.secondaryNumber1).trim() : undefined,
      secondaryNumber2: body.secondaryNumber2 ? String(body.secondaryNumber2).trim() : undefined,

      password: String(body.password || ""),
      role: String(body.role || "individual").trim(),
      roleTitle: body.roleTitle ? String(body.roleTitle).trim() : undefined,
      roleDescription: body.roleDescription ? String(body.roleDescription).trim() : undefined,

      // Consents
      isTermsAndConditionAccepted: !!body.isTermsAndConditionAccepted,
      isPrivacyAndPolicyAccepted: !!body.isPrivacyAndPolicyAccepted,
      isCookiesPolicyAccepted: !!body.isCookiesPolicyAccepted,

      // Marketing
      marketingOptIn: !!body.subscribe,
    });

    // required
    const missing: string[] = [];
    if (!payload.fullName) missing.push("fullName");
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

    // Duplicate check — now actually enforced. Previously this query ran
    // but its result was never inspected, so registration silently fell
    // through to User.create() regardless and relied on the unique-index
    // error (code 11000) in the catch block to reject duplicates. That
    // still worked, but gave a generic error message and did a wasted read
    // on every successful registration. This makes the intent explicit.
    const dup = await User.findOne({
      $and: [
        { $or: [{ email: payload.email }, { primaryNumber: payload.primaryNumber }] },
        { accountStatus: { $nin: ["Deleted"] } },
      ],
    });

    if (dup) {
      const field = dup.email === payload.email ? "email" : "phone number";
      return NextResponse.json(
        { error: `An account with that ${field} already exists.` },
        { status: 409 }
      );
    }

    // generate incremental userId
    const userId = await getNextUserId(12);

    const passwordHash = await hash(payload.password, 10);

    const created = await User.create({
      ...payload,
      userId,
      password: passwordHash,

      // Save structured address + audit only if present
      ...(Object.keys(address).length ? { address } : {}),
      ...(Object.keys(audit).length ? { audit } : {}),

      // status fields
      accountStatus: "Pending",
      isNewUser: true,

      // verification
      // NOTE: hardcoding both of these to `true` at registration bypasses
      // the OTP flow your schema is built for (see OtpSchema — code,
      // expiresAt, attempts, lockedUntil). Confirm whether OTP verification
      // already happens in an earlier step of this registration wizard
      // before this route runs; if not, this marks unverified accounts as
      // verified by default.
      isEmailVerified: true,
      isPrimaryNumberVerified: true,

      provider: "credentials",
    });

    // welcome email (don't block the response if it fails)
    try {
      await sendWelcomeEmail({
        fullName: created.fullName,
        email: created.email,
        country: created.address?.country,
      });
    } catch (err) {
      console.error("Welcome email failed:", err);
    }

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
          fullName: created.fullName,
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