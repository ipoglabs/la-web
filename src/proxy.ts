import { NextRequest, NextResponse } from "next/server";
import {
  COUNTRY_COOKIE,
  PENDING_COOKIE,
  BLOCKED_COOKIE,
  PENDING_MAX_AGE,
  COOKIE_MAX_AGE,
  BLOCKED_COOKIE_MAX_AGE,
  isAllowedCountry,
} from "@/lib/country-context";
import { COUNTRY_CONFIGS, getConfigByIso, type CountryCode } from "@/config";
import { isSimpleLayoutRoute } from "@/lib/layout-routes";

/* ─── Country-prefixed URLs (/in/, /gb/, /sg/) ──────────────────────────────
 * [ARCHITECTURE — 2026-07-11] The URL segment is the source of truth for
 * country whenever present — it always wins over the cookie. This is what
 * powers app/[country]/* routes (e.g. /gb/listings). We still sync the
 * cookie so a later visit to an unprefixed route (e.g. "/") remembers the
 * last country the user browsed in.
 * ───────────────────────────────────────────────────────────────────────── */
const COUNTRY_URL_CODES = Object.keys(COUNTRY_CONFIGS) as CountryCode[];
const COUNTRY_PREFIX_RE = new RegExp(`^/(${COUNTRY_URL_CODES.join("|")})(?:/|$)`, "i");

function getUrlCountryCode(pathname: string): CountryCode | null {
  const match = pathname.match(COUNTRY_PREFIX_RE);
  if (!match) return null;
  return match[1].toLowerCase() as CountryCode;
}

/* ─── Internal-route Basic Auth ────────────────────────────────────────────
 * Protects /design-system and /snippets with HTTP Basic Auth.
 * Set credentials via environment variables (see .env.local):
 *   BASIC_AUTH_USER
 *   BASIC_AUTH_PASS
 * No hardcoded fallback — if either variable is unset, every request is
 * rejected (fail closed) rather than silently accepting a well-known
 * dev/dev123-style default that would also work in production.
 * ───────────────────────────────────────────────────────────────────────── */
const INTERNAL_PREFIXES = ["/design-system", "/snippets", "/la-dev"];

function requiresAuth(pathname: string): boolean {
  return INTERNAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function basicAuthResponse(): NextResponse {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Internal Reference", charset="UTF-8"' },
  });
}

/**
 * Constant-time string comparison — avoids leaking credential correctness
 * via response-time side channels. `crypto.timingSafeEqual` is Node-only and
 * unavailable in the Edge runtime middleware runs in, so this is a manual
 * equivalent: every character is compared (no early return), and the result
 * is only known once the full string has been scanned.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function checkBasicAuth(request: NextRequest): boolean {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASS;

  // Fail closed: with no configured credentials, nothing can authenticate.
  if (!expectedUser || !expectedPass) return false;

  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Basic ")) return false;

  const base64 = authHeader.slice("Basic ".length);
  // Next.js Edge runtime supports atob
  const decoded = atob(base64);
  const colon = decoded.indexOf(":");
  if (colon === -1) return false;

  const user = decoded.slice(0, colon);
  const pass = decoded.slice(colon + 1);
  return timingSafeEqual(user, expectedUser) && timingSafeEqual(pass, expectedPass);
}

/* ─── Browser UA quick-block ────────────────────────────────────────────────
 * Catches the most obviously unsupported browsers before any React code runs.
 * This is a defence-in-depth layer — the client-side BrowserGuard does the
 * authoritative feature-detection check.
 *
 * We only block UAs we are 100% certain about:
 *   • "Trident/"   → Internet Explorer (any version)
 *   • "Edge/" w/o "Edg/" → Legacy EdgeHTML engine (Edge 12–18)
 *
 * We deliberately do NOT try to parse Chrome/Firefox/Safari version numbers
 * here — UA strings are easy to spoof and fragile to parse. The client guard
 * handles those cases accurately via CSS.supports() checks.
 * ─────────────────────────────────────────────────────────────────────────── */
function isObsoleteUA(ua: string): boolean {
  const u = ua.toLowerCase();
  // Internet Explorer — all versions carry "trident/" in their UA
  if (u.includes("trident/")) return true;
  // Legacy EdgeHTML (Edge 12–18). Chromium Edge uses "Edg/" (no trailing 'e').
  if (u.includes("edge/") && !u.includes("edg/")) return true;
  return false;
}

// Routes that render with their own full-page layout — no AppHeader/AppFooter.
// Defined at module level so both the auth check and the bare-layout block can use it.
const BARE_LAYOUT_ROUTES = ["/unsupported", "/design-system", "/snippets", "/la-dev"];

function isBareLayoutRoute(pathname: string): boolean {
  return BARE_LAYOUT_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Always bypass — never gate static / API / file paths ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/country-select" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ── Security: strip any client-supplied x-bare-layout header ─────────────
  // This header is set ONLY by our own middleware for /unsupported.
  // If a user injects it manually they would bypass the full app shell
  // (CountryProvider, AppHeader, etc.) on any page — strip it unconditionally
  // from every incoming request before we selectively set it below.
  const sanitisedHeaders = new Headers(request.headers);
  sanitisedHeaders.delete("x-bare-layout");

  // ── Browser UA quick-block — redirect obsolete browsers immediately ──
  const ua = request.headers.get("user-agent") ?? "";
  if (isObsoleteUA(ua)) {
    const url = request.nextUrl.clone();
    url.pathname = "/unsupported";
    return NextResponse.redirect(url, { status: 302 });
  }

  // ── Internal routes — Basic Auth only, exempt from country gate ──
  if (requiresAuth(pathname)) {
    if (!checkBasicAuth(request)) return basicAuthResponse();
    // Auth passed → fall through to bare-layout block (strips app shell)
  }

  // ── Bare layout routes — render without app shell (no header/footer) ──
  // Signal the root layout via a forwarded request header so it can skip
  // CountryProvider, AppHeader, AppFooter for these routes.
  // Add any route here that owns its own full-page layout.
  if (isBareLayoutRoute(pathname)) {
    sanitisedHeaders.set("x-bare-layout", "1");
    return NextResponse.next({ request: { headers: sanitisedHeaders } });
  }

  // ── Simple layout routes — minimal header/footer (no POST CTA, no favourites) ──
  // Auth/onboarding journeys. Root layout reads this and passes variant="simple".
  if (isSimpleLayoutRoute(pathname)) {
    sanitisedHeaders.set("x-simple-layout", "1");
    return NextResponse.next({ request: { headers: sanitisedHeaders } });
  }

  // ── Landing page — POC demo: always show guest header so the logged-out ──
  // ── experience is visible on the homepage regardless of mock session.   ──
  // TODO [AUTH — BEFORE PRODUCTION]: Remove this block. Once real auth is  ──
  // ── wired, getSession() returns null for unauthenticated users naturally.──
  if (pathname === "/") {
    sanitisedHeaders.set("x-guest-demo", "1");
    return NextResponse.next({ request: { headers: sanitisedHeaders } });
  }

  // ── Country-prefixed URL (/in/, /gb/, /sg/) — URL wins over cookie ──
  // Bypasses the detection/blocked-overlay gate entirely: the URL already
  // declares an explicit, supported country, so there is nothing to detect.
  const urlCountryCode = getUrlCountryCode(pathname);
  if (urlCountryCode) {
    const iso = COUNTRY_CONFIGS[urlCountryCode].isoCode;
    sanitisedHeaders.set("x-url-country", iso);
    const urlRes = NextResponse.next({ request: { headers: sanitisedHeaders } });
    urlRes.cookies.set(COUNTRY_COOKIE, iso, {
      path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax", httpOnly: false,
    });
    urlRes.cookies.delete(PENDING_COOKIE);
    urlRes.cookies.delete(BLOCKED_COOKIE);
    return urlRes;
  }

  // ── Bare /listings — 301 redirect to its country-prefixed URL ──────────────
  // [ARCHITECTURE — 2026-07-13] Part of the POC→PROD SEO URL migration (see
  // .github/skills/la-seo/SKILL.md, Phase 4). Only /listings has a
  // [country]-prefixed twin today (app/[country]/listings re-export shim) —
  // do NOT extend this redirect to other routes until they get their own
  // shim. Fires only once the country is already known (cookie, MOCK_COUNTRY,
  // or CF header) — a first-time visitor with no signal yet falls through
  // unchanged to the country gate below and gets redirected on their *next*
  // request, once CountryDetector / the picker overlay has set the cookie.
  if (pathname === "/listings" || pathname.startsWith("/listings/")) {
    const cookieIso = request.cookies.get(COUNTRY_COOKIE)?.value ?? "";
    const mockIso   = (process.env.MOCK_COUNTRY ?? "").toUpperCase();
    const cfHeaderName = process.env.COUNTRY_HEADER || "cf-ipcountry";
    const cfIso     = (request.headers.get(cfHeaderName) ?? "").toUpperCase();

    const resolvedIso = isAllowedCountry(cookieIso)
      ? cookieIso
      : isAllowedCountry(mockIso)
      ? mockIso
      : isAllowedCountry(cfIso)
      ? cfIso
      : "";

    if (resolvedIso) {
      const entry = getConfigByIso(resolvedIso);
      if (entry) {
        const url = request.nextUrl.clone();
        url.pathname = `/${entry.code}${pathname}`;
        return NextResponse.redirect(url, { status: 301 });
      }
    }
  }

  // ── Country gate — all user-facing routes ──

  // 1. Fast path — cookie already resolved for this browser
  const existingCountry = request.cookies.get(COUNTRY_COOKIE)?.value ?? "";
  if (isAllowedCountry(existingCountry)) return NextResponse.next();

  const res = NextResponse.next();

  // 2. Dev shortcut — MOCK_COUNTRY env var (set in .env.local for local dev)
  //    e.g. MOCK_COUNTRY=IN  → skips IP detection entirely in local dev
  //    TODO(deploy): Ensure MOCK_COUNTRY is NOT set in production env vars.
  //    A CI lint check for this is recommended (e.g. check .env.production).
  const mockCountry = (process.env.MOCK_COUNTRY ?? "").toUpperCase();
  if (mockCountry && isAllowedCountry(mockCountry)) {
    res.cookies.set(COUNTRY_COOKIE, mockCountry, {
      path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax", httpOnly: false,
    });
    res.cookies.delete(PENDING_COOKIE);
    res.cookies.delete(BLOCKED_COOKIE);
    return res;
  }

  // 3. Cloudflare (or configurable proxy) header
  //    In production, CF injects cf-ipcountry on every request.
  //    Override via COUNTRY_HEADER env var for other CDNs (e.g. x-vercel-ip-country).
  //    TODO(infra): Add a Cloudflare WAF rule or Transform Rule to strip
  //    cf-ipcountry spoofing from untrusted origins if running behind another proxy.
  const cfHeader = process.env.COUNTRY_HEADER || "cf-ipcountry";
  const cfCode   = (request.headers.get(cfHeader) ?? "").toUpperCase();
  if (cfCode) {
    if (isAllowedCountry(cfCode)) {
      // Allowed — commit country, clear any stale blocked/pending flags
      res.cookies.set(COUNTRY_COOKIE, cfCode, {
        path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax", httpOnly: false,
      });
      res.cookies.delete(PENDING_COOKIE);
      res.cookies.delete(BLOCKED_COOKIE);
    } else {
      // Detected but not served — client will show contextual picker overlay
      res.cookies.set(BLOCKED_COOKIE, cfCode, {
        path: "/", maxAge: BLOCKED_COOKIE_MAX_AGE, sameSite: "lax", httpOnly: false,
      });
      res.cookies.delete(PENDING_COOKIE);
    }
    return res;
  }

  // 4. No signal — flag for client-side IP detection (CountryDetector fires ipinfo.io)
  if (!request.cookies.get(PENDING_COOKIE)?.value) {
    res.cookies.set(PENDING_COOKIE, "1", {
      path: "/", maxAge: PENDING_MAX_AGE, sameSite: "lax", httpOnly: false,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
