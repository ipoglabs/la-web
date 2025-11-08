// lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  role: string;
};

/** ✅ create session (used in register & login) */
export function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: MAX_AGE,
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  return token;
}

/** ✅ read + verify session cookie (used in getCurrentUser) */
export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as SessionPayload;
  } catch {
    return null;
  }
}

/** ✅ added verifyToken to avoid the error */
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as SessionPayload;
  } catch (err) {
    return null;
  }
}

/** ✅ logout */
export function clearSession() {
  cookies().delete(COOKIE_NAME);
}
