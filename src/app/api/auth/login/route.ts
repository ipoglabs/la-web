import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "session";
const UINFO_COOKIE_NAME = "uinfo";
const MAX_AGE = 60 * 60 * 24 * 7;

function signJwt(payload: object) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({} as any));

    const rawIdentifier = String(body?.identifier ?? "").trim();
    const password = String(body?.password ?? "");

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: "Email / phone and password are required." },
        { status: 400 }
      );
    }

    const isEmailId = rawIdentifier.includes("@");
    const emailRaw = isEmailId ? rawIdentifier.toLowerCase() : undefined;
    const phoneRaw = isEmailId ? undefined : rawIdentifier;

    const query = isEmailId
      ? { email: emailRaw }
      : { primaryNumber: phoneRaw };

    const user: any = await User.findOne(query).lean();

    // IMPORTANT:
    // Deleted / suspended users must behave like invalid login.
    if (
  !user ||
  user.isDeleted === true ||
  user.isSuspended === true ||
  user.accountStatus === "Suspended" ||
  user.accountStatus === "Deleted"
) {
  return NextResponse.json(
    { error: "Account not found with that email / phone." }, // 👈 change here
    { status: 404 }               // 👈 also important
  );
}

    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const ok = await compare(password, user.password);

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    const token = signJwt({
      userId: String(user._id),
      email: user.email,
      primaryNumber: user.primaryNumber,
      role: user.role ?? "user",
    });

    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: String(user._id),
          email: user.email,
          fullName: user.fullName,
          role: user.role ?? "user",
          primaryNumber: user.primaryNumber,
          locality: user.locality,
        },
        token,
      },
      { status: 200 }
    );

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });

    res.cookies.set(
      UINFO_COOKIE_NAME,
      JSON.stringify({
        id: String(user._id),
        ph: user.primaryNumber,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      }
    );

    return res;
  } catch (err) {
    console.error("Login error:", err);

    return NextResponse.json(
      { error: "Something went wrong during login." },
      { status: 500 }
    );
  }
}