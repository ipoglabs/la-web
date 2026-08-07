import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { getNextUserId } from "@/lib/sequence";
import { verifyIdentityProof } from "@/lib/auth-proof";
import { normalizeTarget } from "@/lib/otpUtils";
import { sendWelcomeEmail } from "@/lib/sendWelcomeEmail";
import { createUserSession } from "@/lib/userSession";
import { logActivity } from "@/lib/activityLog";
import { BASE_ROLE, ROLES, type RoleId } from "@/config/roles";
import { isAdminEmail } from "@/lib/admin";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7;
const VALID_ROLE_IDS = new Set<string>(ROLES.map((r) => r.id));

// OAuth methods prove identity via the short-lived, httpOnly cookie
// google-callback/apple-callback already set for a brand-new user — see
// that route for how it's minted. Reading it server-side here (rather than
// trusting a client-supplied proof string) means the identity check never
// leaves the server.
const OAUTH_PENDING_COOKIE: Record<string, string> = {
  google: "google_pending",
  apple: "apple_pending",
};

function requireSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
}

function signJwt(payload: object) {
  return jwt.sign(payload, requireSecret(), { expiresIn: MAX_AGE });
}

/**
 * POST /api/auth/complete-profile
 * { method, identifier, proof, fullName, gender, dateOfBirthIso, roleIds, specialties, customRole }
 *
 * Real account creation for the Register journey (final step, called by
 * RoleStep's Skip/Continue) for every signup method:
 *   - magic_link / phone_otp: identity proven by `proof`, an auth-proof
 *     token minted after OTP verification (see lib/auth-proof.ts).
 *   - google: identity proven by the `google_pending` cookie
 *     google-callback set right after real OAuth success (see
 *     GoogleBootstrap.tsx for how the onboarding wizard picks the journey
 *     up from there); `identifier` is Google's own (trustworthy) email,
 *     matched directly against the cookie.
 *   - apple: two-factor — the `apple_pending` cookie (apple-callback,
 *     AppleBootstrap.tsx) proves the Apple sign-in itself, but Apple never
 *     gives us a trustworthy email (see apple-callback/route.ts), so
 *     `identifier` is instead a real email the user separately typed +
 *     OTP-verified via register/apple-email/AppleEmailStep.tsx (reusing
 *     the magic_link proof flow) — proven by `proof`, not by matching the
 *     cookie. Apple's own email-or-sub lands in `appleEmailId`
 *     (models/user.ts), never in `identifier`/`email`.
 *
 * Per the schema migration agreed for this port: email and primaryNumber
 * are each optional+sparse (one is required, enforced by the model's
 * pre-validate hook) and password is optional — this flow never sets one,
 * including for google/apple (they don't use password auth either).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const method = String(body?.method || "");
    const identifier: string | null = body?.identifier ?? null;
    const fullName = String(body?.fullName || "").trim();
    const gender = String(body?.gender || "").trim();
    const dateOfBirthIso = String(body?.dateOfBirthIso || "");
    // Never trust client-supplied role ids — mirrors updateProfile.ts's
    // VALID_ROLE_IDS check for the same field (config/roles.ts's fixed list).
    const rawRoleIds: unknown = body?.roleIds;
    const roleIds: RoleId[] = Array.isArray(rawRoleIds)
      ? (rawRoleIds.filter((id): id is RoleId => typeof id === "string" && VALID_ROLE_IDS.has(id)))
      : [];
    const specialties = body?.specialties && typeof body.specialties === "object" ? body.specialties : {};
    const customRole: string | null = body?.customRole ?? null;

    const isOAuth = method === "google" || method === "apple";
    if (!isOAuth && method !== "magic_link" && method !== "phone_otp") {
      return NextResponse.json({ error: "Unsupported method for this route" }, { status: 400 });
    }
    if (!identifier || !fullName || !dateOfBirthIso) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let oauthImage: string | undefined;
    let pendingCookieName: string | undefined;
    // Apple only — see apple-callback/route.ts and register/apple-email/
    // AppleEmailStep.tsx. Never set for google (Google's `identifier` IS
    // its trustworthy email, matched directly against the pending cookie).
    let appleEmailId: string | undefined;

    if (isOAuth) {
      pendingCookieName = OAUTH_PENDING_COOKIE[method];
      const cookieStore = await cookies();
      const pendingToken = cookieStore.get(pendingCookieName)?.value;
      if (!pendingToken) {
        return NextResponse.json(
          { error: "Your sign-in session expired. Please sign in again." },
          { status: 401 }
        );
      }
      try {
        const decoded = jwt.verify(pendingToken, requireSecret()) as { payload: string };

        if (method === "google") {
          const pending = JSON.parse(decoded.payload) as { email: string; name: string; image: string };
          if (pending.email.toLowerCase() !== identifier.toLowerCase()) {
            return NextResponse.json({ error: "Identity not verified" }, { status: 401 });
          }
          oauthImage = pending.image || undefined;
        } else {
          // apple — the pending cookie proves the Apple sign-in happened
          // (appleEmailId is Apple's own email-or-sub, never a reliably
          // reachable address — see models/user.ts). `identifier` here is a
          // DIFFERENT, real email the user just typed and OTP-verified via
          // the reused magic-link flow (AppleEmailStep) — proven by
          // `proof`, not by matching the pending cookie the way Google's
          // identifier is.
          const pending = JSON.parse(decoded.payload) as {
            appleEmailId: string;
            name: string;
            image: string;
          };
          const proof = String(body?.proof || "");
          if (!verifyIdentityProof(proof, "magic_link", identifier.toLowerCase())) {
            return NextResponse.json({ error: "Identity not verified" }, { status: 401 });
          }
          oauthImage = pending.image || undefined;
          appleEmailId = pending.appleEmailId;
        }
      } catch {
        return NextResponse.json(
          { error: "Your sign-in session expired. Please sign in again." },
          { status: 401 }
        );
      }
    } else {
      const proof = String(body?.proof || "");
      if (!verifyIdentityProof(proof, method, identifier)) {
        return NextResponse.json({ error: "Identity not verified" }, { status: 401 });
      }
    }

    await dbConnect();

    // Every method except phone_otp is keyed off email.
    const usesEmail = method !== "phone_otp";
    const target = normalizeTarget(usesEmail ? "email" : "phone", identifier);

    const dup = await User.findOne({
      ...(usesEmail ? { email: target } : { primaryNumber: target }),
      accountStatus: { $nin: ["Deleted"] },
    });
    if (dup) {
      return NextResponse.json(
        { error: `An account with that ${usesEmail ? "email" : "phone number"} already exists.` },
        { status: 409 }
      );
    }

    const userId = await getNextUserId(12);
    const primaryRole = roleIds[0] ?? BASE_ROLE.id;

    const created = await User.create({
      userId,
      fullName,
      dateOfBirth: new Date(dateOfBirthIso),
      gender: gender || undefined,
      ...(usesEmail ? { email: target, isEmailVerified: true } : { primaryNumber: target, isPrimaryNumberVerified: true }),
      ...(oauthImage ? { image: oauthImage } : {}),
      ...(appleEmailId ? { appleEmailId } : {}),
      publicRole: primaryRole,
      roles: roleIds,
      roleSpecialties: specialties,
      customRole: customRole || undefined,
      provider: isOAuth ? method : "credentials",
      accountStatus: "Active",
      isNewUser: true,
      isTermsAndConditionAccepted: true,
    });

    await logActivity(created._id, "REGISTERED", { method });

    if (created.email) {
      try {
        await sendWelcomeEmail({ fullName: created.fullName, email: created.email });
      } catch (err) {
        console.error("Welcome email failed:", err);
      }
    }

    const sid = await createUserSession(String(created._id), req);
    const token = signJwt({
      userId: String(created._id),
      email: created.email,
      primaryNumber: created.primaryNumber,
      publicRole: created.publicRole ?? "user",
      sid,
    });

    const res = NextResponse.json(
      { data: { id: String(created._id), isAdmin: isAdminEmail(created.email) } },
      { status: 201 }
    );
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    if (pendingCookieName) {
      res.cookies.delete(pendingCookieName);
    }

    return res;
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return NextResponse.json({ error: `That ${field} is already in use.` }, { status: 409 });
    }
    console.error("complete-profile error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create account" }, { status: 500 });
  }
}
