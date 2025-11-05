// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({} as any));
    const emailRaw = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!emailRaw || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: emailRaw }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const ok = await compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    // Sign JWT with string id (prevents ObjectId buffer issues downstream)
    const token = jwt.sign(
      {
        id: String(user._id),
        email: user.email,
        username: user.username,
        role: user.role ?? "user",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: String(user._id),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role ?? "user",
      },
      // If you also want to return the token to SPA/mobile callers, uncomment:
      // token,
    });

    // Auth cookie (HTTP-only)
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // (Optional) tiny readable cookie for UI hints (not sensitive)
    // Remove this block if you prefer not to set a readable cookie.
    res.cookies.set(
      "uinfo",
      JSON.stringify({ id: String(user._id), u: user.username }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
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
