import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ── Admin ──────────────────────────────────────────────────────────────────────
const ADMIN_COOKIE = "admin_session";

function isAdminRole(role?: string) {
  return ["super_admin", "admin", "moderator", "support", "analyst"].includes(
    String(role || "")
  );
}

async function verifyEdgeJwt(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as any;
  } catch {
    return null;
  }
}

// ── Country detection ──────────────────────────────────────────────────────────
const COUNTRY_COOKIE = "user_country";
const SUPPORTED      = ["IN", "SG", "GB"];

// These routes bypass the country guard completely
const EXEMPT_PREFIXES = [
  "/select-country",
  "/login",
  "/register",
  "/api",
  "/bo",
  "/bo-login",
  "/robots.txt",
  "/sitemap.xml",
];

function setCountryCookie(res: NextResponse, code: string): NextResponse {
  res.cookies.set(COUNTRY_COOKIE, code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: false, // must be readable by client JS (countryStore)
  });
  return res;
}

// ── Main middleware ────────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ── Admin route guard (unchanged) ─────────────────────────────────────────
  if (pathname.startsWith("/bo")) {
    if (pathname === "/bo-login" || pathname === "/bo/register") {
      return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/bo-login";
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }

    const session = await verifyEdgeJwt(token);
    if (!session || !isAdminRole(session.role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/bo-login";
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // ── Country guard (all other routes) ──────────────────────────────────────
  const isExempt  = EXEMPT_PREFIXES.some((p) => pathname.startsWith(p));
  const hasCookie = req.cookies.has(COUNTRY_COOKIE);

  // Already resolved or exempt route — pass straight through
  if (isExempt || hasCookie) return NextResponse.next();

  const cfCode     = req.headers.get("cf-ipcountry") ?? "";
  const isSupported = SUPPORTED.includes(cfCode);

  if (isSupported) {
    // Cloudflare confirmed a supported country — set cookie, let them in
    return setCountryCookie(NextResponse.next(), cfCode);
  }

  // Unknown / unsupported country — send to the country picker
  const url = req.nextUrl.clone();
  url.pathname = "/select-country";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every route except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
