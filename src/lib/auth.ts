// src/lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/config/database";
import User from "@/models/user";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  email?: string;
  role?: string;
  username?: string;
  primaryNumber?: string;
};

function requireSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
}

/** create session */
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

/** read session */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, requireSecret()) as SessionPayload;

    await connectDB();

    const user = await User.findById(payload.userId).select("isDeleted");

    if (!user || user.isDeleted) return null;

    return payload;
  } catch {
    return null;
  }
}

/** logout */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}