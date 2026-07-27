import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { isAppleConfigured, generateAppleClientSecret } from "@/lib/appleClientSecret";

// Apple is only registered when fully configured (see appleClientSecret.ts) —
// this list omits it until the env vars exist, rather than constructing a
// provider with missing key material that would throw the moment someone
// tried to sign in. Once the env vars exist, this starts registering it
// automatically, no other code change needed.

// Apple always calls back via a cross-site POST (response_mode=form_post —
// see node_modules/next-auth/providers/apple.js), never a GET redirect like
// Google. Browsers strip SameSite=Lax cookies from cross-site POST
// navigations (Lax only survives top-level GET), so NextAuth's default
// pkce.code_verifier cookie (Lax) never reaches the callback and it throws
// "PKCE code_verifier cookie was missing" — confirmed in Vercel runtime
// logs for /api/auth/[...nextauth] (OAUTH_CALLBACK_ERROR, providerId:
// 'apple'). Fix: SameSite=None (requires Secure) for that one cookie in
// production. None is a superset of Lax, so this doesn't change Google's
// (GET-redirect) behavior. Left at the default Lax in dev, since
// SameSite=None without Secure is silently rejected by browsers and local
// dev runs over http:// — moot anyway, Apple can't be tested on localhost
// regardless (see appleClientSecret.ts).
const useSecureCookies = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...(isAppleConfigured()
      ? [
          AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: generateAppleClientSecret(),
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    pkceCodeVerifier: {
      name: useSecureCookies
        ? "__Secure-next-auth.pkce.code_verifier"
        : "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? "none" : "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
      },
    },
  },
};
