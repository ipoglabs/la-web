// lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "session";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  role: string;
};

export function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: TTL_SECONDS,
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });

  return token; // returned for debugging if you ever need it
}

export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}
