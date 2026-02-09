// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "admin_session";

function isAdminRole(role?: string) {
  return ["super_admin", "admin", "moderator", "support", "analyst"].includes(String(role || ""));
}

async function verifyEdgeJwt(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as any; // { adminId, email, role, country }
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!pathname.startsWith("/bo")) return NextResponse.next();

  // allow public admin pages
  if (pathname === "/bo-login" || pathname === "/bo/register") {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/bo-login";
    url.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  const session = await verifyEdgeJwt(token);
  if (!session || !isAdminRole(session.role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/bo-login";
    url.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/bo/:path*"],
};
