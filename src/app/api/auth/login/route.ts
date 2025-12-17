import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function signJwt(payload: object) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
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

    const query = isEmailId ? { email: emailRaw } : { primaryNumber: phoneRaw };

    // IMPORTANT: include password in projection
    const user = await User.findOne(query).lean();
    if (!user) {
      return NextResponse.json(
        { error: "Account not found with that email / phone." },
        { status: 404 }
      );
    }

    const ok = await compare(password, (user as any).password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (!(user as any).isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    const token = signJwt({
      userId: String((user as any)._id),
      email: (user as any).email,
      primaryNumber: (user as any).primaryNumber,
      role: (user as any).role ?? "user",
    });

    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: String((user as any)._id),
          email: (user as any).email,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          role: (user as any).role ?? "user",
          primaryNumber: (user as any).primaryNumber,
          locality: (user as any).locality,
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
      "uinfo",
      JSON.stringify({
        id: String((user as any)._id),
        ph: (user as any).primaryNumber,
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
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong during login." },
      { status: 500 }
    );
  }
}
