// src/lib/adminAuth.ts
import jwt from "jsonwebtoken";

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminRole = "super_admin" | "admin" | "moderator" | "support" | "analyst";

export type AdminSession = {
  adminId: string;
  email: string;
  role: AdminRole;
  country?: string;
};

export function isAdminRole(role?: string): role is AdminRole {
  return ["super_admin", "admin", "moderator", "support", "analyst"].includes(String(role || ""));
}

export function signAdminJwt(payload: AdminSession) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ADMIN_MAX_AGE });
}

export function verifyAdminJwt(token: string): AdminSession | null {
  try {
    if (!process.env.JWT_SECRET) return null;
    return jwt.verify(token, process.env.JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}
