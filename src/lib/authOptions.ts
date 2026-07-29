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
// navigations (Lax only survives top-level GET), so two of NextAuth's
// default Lax cookies never reach the callback:
//   - pkce.code_verifier — throws "PKCE code_verifier cookie was missing"
//     (confirmed in Vercel runtime logs, OAUTH_CALLBACK_ERROR, providerId:
//     'apple')
//   - callback-url — fails silently. core/lib/callback-url.js's
//     createCallbackUrl() falls back to `url.origin` (the site root) when
//     both the cookie AND the callbackUrl query param are absent, and
//     core/routes/callback.js's OAuth branch redirects straight to that
//     value with no further checks. So sign-in itself succeeds (session
//     cookie gets set) but the browser lands on "/" instead of our
//     callbackUrl ("/api/auth/apple-callback"), skipping the new-vs-
//     existing-user handling in that route entirely — confirmed via
//     Vercel runtime logs: POST /api/auth/callback/apple (302) immediately
//     followed by GET / with zero /api/auth/apple-callback hits anywhere
//     in between.
// Fix: SameSite=None (requires Secure) for both cookies in production.
// None is a superset of Lax, so this doesn't change Google's (GET-redirect)
// behavior. Left at the default Lax in dev, since SameSite=None without
// Secure is silently rejected by browsers and local dev runs over
// http:// — moot anyway, Apple can't be tested on localhost regardless
// (see appleClientSecret.ts).
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
  // Without this, NextAuth falls back to its own unstyled built-in pages —
  // both for the interactive /api/auth/signin form AND for the subset of
  // error codes (Signin, OAuthSignin, OAuthCallback, OAuthCreateAccount,
  // EmailCreateAccount, Callback — see node_modules/next-auth/core/index.js)
  // that it always routes to /signin?error=... regardless of `pages.error`.
  // Pointing both at our own /login screen means MethodStep.tsx's
  // `error` search-param handling is what the user actually sees.
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // Default next-auth only copies name/email/image from the token onto
    // session.user (see node_modules/next-auth/core/routes/session.js) —
    // `token.sub` (the provider's own user id; for Apple, profile.sub, the
    // "created id" apple-callback/route.ts falls back to when Apple sends
    // no email claim) never reaches session.user without this.
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string }).id = token.sub;
      }
      return session;
    },
  },
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
    callbackUrl: {
      name: useSecureCookies
        ? "__Secure-next-auth.callback-url"
        : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? "none" : "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
};
