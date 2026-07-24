import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { createUserSession } from "@/lib/userSession";

/**
 * Mirrors google-callback/route.ts exactly — see that file for the full
 * rationale. One Apple-specific gap: Apple's id_token carries no `name`
 * claim at all (see node_modules/next-auth/src/providers/apple.ts's
 * `profile()` mapping) — the user's name is only ever delivered once, as
 * a separate form-POST field on the very first authorization, which this
 * basic NextAuth provider config doesn't capture. `session.user.name` will
 * in practice always be empty here; the `|| ""` fallback below (mirroring
 * Google's) already handles that gracefully — apple-complete/route.ts
 * falls back to "Apple User" same as Google falls back to "Google User".
 */
const SESSION_COOKIE = "session";
const UINFO_COOKIE = "uinfo";
const PENDING_COOKIE = "apple_pending";
const MAX_AGE = 60 * 60 * 24 * 7;

function requireSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login?error=apple_failed", req.url));
  }

  const email = session.user.email.toLowerCase();

  await dbConnect();

  const user = await User.findOne({
    email,
    isDeleted: { $ne: true },
  });

  // New Apple user — store profile in a short-lived signed cookie, redirect to completion
  if (!user) {
    const payload = JSON.stringify({
      email,
      name: session.user.name || "",
      image: session.user.image || "",
    });

    const pendingToken = jwt.sign({ payload }, requireSecret(), { expiresIn: 3600 });

    const res = NextResponse.redirect(new URL("/register/apple-complete", req.url));
    res.cookies.set(PENDING_COOKIE, pendingToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });
    return res;
  }

  // Suspended / deleted
  if (
    user.isSuspended ||
    user.accountStatus === "Suspended" ||
    user.accountStatus === "Deleted"
  ) {
    return NextResponse.redirect(new URL("/login?error=suspended", req.url));
  }

  // Existing user — issue our JWT and redirect to client-side hydration page
  const sid = await createUserSession(String(user._id), req);
  const token = jwt.sign(
    {
      userId: String(user._id),
      email: user.email,
      primaryNumber: user.primaryNumber,
      role: user.role ?? "user",
      sid,
    },
    requireSecret(),
    { expiresIn: MAX_AGE }
  );

  const res = NextResponse.redirect(new URL("/auth/apple-success", req.url));

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  res.cookies.set(
    UINFO_COOKIE,
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
}
