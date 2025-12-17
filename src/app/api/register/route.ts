import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function stripEmpty(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
}

// ✅ Convert to "Name Case" (Title Case)
// "akilan" -> "Akilan"
// "mOHan" -> "Mohan"
// "akilan mohan" -> "Akilan Mohan"
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

    const payload = stripEmpty({
      // ✅ camel/title case for names
      firstName: toNameCase(body.firstName),
      lastName: toNameCase(body.lastName),

      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: String(body.gender || "other").trim(),

      nationality: body.nationality ? String(body.nationality).trim() : undefined,
      country: body.country ? String(body.country).trim() : undefined,
      state: body.state ? String(body.state).trim() : undefined,
      residency: body.residency ? String(body.residency).trim() : undefined,

      email: String(body.email || "").trim().toLowerCase(),

      primaryNumber: String(body.primaryNumber || "").trim(),
      secondaryNumber1: body.secondaryNumber1 ? String(body.secondaryNumber1).trim() : undefined,
      secondaryNumber2: body.secondaryNumber2 ? String(body.secondaryNumber2).trim() : undefined,

      locality: String(body.locality || "").trim(),

      password: String(body.password || ""),
      role: String(body.role || "user").trim(),

      roleTitle: body.roleTitle ? String(body.roleTitle).trim() : undefined,
      roleDescription: body.roleDescription ? String(body.roleDescription).trim() : undefined,

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

    // duplicate check ONLY on email + primaryNumber
    const dup = await User.findOne({
      $or: [{ email: payload.email }, { primaryNumber: payload.primaryNumber }],
    })
      .select("email primaryNumber")
      .lean();

    if (dup) {
      if (dup.email === payload.email) {
        return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
      }
      if (dup.primaryNumber === payload.primaryNumber) {
        return NextResponse.json(
          { error: "That phone number is already in use." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hash(payload.password, 10);

    const created = await User.create({
      ...payload,
      password: passwordHash,
      isEmailVerified: true,
      isPhoneVerified: true,
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
          email: created.email,
          firstName: created.firstName,
          lastName: created.lastName,
          role: created.role ?? "user",
          locality: created.locality,
          roleTitle: created.roleTitle ?? null,
          roleDescription: created.roleDescription ?? null,
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

    res.cookies.set(
      "uinfo",
      JSON.stringify({
        id: String(created._id),
        loc: created.locality,
        rt: created.roleTitle ?? undefined,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      }
    );

    return res;
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return NextResponse.json({ error: `That ${field} is already in use.` }, { status: 409 });
    }
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
