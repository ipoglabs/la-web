import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { isAppleConfigured, generateAppleClientSecret } from "@/lib/appleClientSecret";

// Apple is only registered when fully configured (see appleClientSecret.ts) —
// none of its 4 env vars are set yet, so this list omits it for now rather
// than constructing a provider with missing key material that would throw
// the moment someone tried to sign in. Once the env vars exist, this starts
// registering it automatically, no other code change needed.
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
};
