// src/lib/auth.ts
import { cookies } from "next/headers";
import { cache } from "react";
import jwt from "jsonwebtoken";
import connectDB from "@/config/database";
import User from "@/models/user";

const COOKIE_NAME = "session";
const LEGACY_COOKIE_NAME = "token";
const UINFO_COOKIE_NAME = "uinfo";
const MAX_AGE = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  id?: string;
  email?: string;
  role?: string;
  username?: string;
  primaryNumber?: string;
  sub?: string;
};

function requireSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return process.env.JWT_SECRET;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    if (!token) return null;

    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
    return jwt.verify(cleanToken, requireSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, requireSecret(), {
    expiresIn: MAX_AGE,
  });

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  return token;
}

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(COOKIE_NAME)?.value ||
    cookieStore.get(LEGACY_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const userId = payload.userId || payload.id;
  if (!userId) return null;

  try {
    await connectDB();

    const user = await User.findById(userId).select(
      "isDeleted isSuspended accountStatus"
    );

    if (!user) return null;

    if (
      user.isDeleted === true ||
      user.isSuspended === true ||
      user.accountStatus === "Suspended" ||
      user.accountStatus === "Deleted"

    ) {
      return null;
    }

    return {
      ...payload,
      userId,
    };
  } catch {
    return null;
  }
});

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(LEGACY_COOKIE_NAME);
  cookieStore.delete(UINFO_COOKIE_NAME);
}