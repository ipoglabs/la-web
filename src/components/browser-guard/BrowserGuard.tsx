"use client";

/**
 * BrowserGuard.tsx
 *
 * Client component that gates the entire application behind a browser
 * compatibility check. Runs on the first client-side render and redirects
 * to /unsupported if any critical feature is missing.
 *
 * Placement: wrap the <body> content in RootLayout — outside CountryProvider
 * and all app logic, so nothing boots in an unsupported browser.
 *
 * Behaviour:
 *  - While checking  → renders null (no flash of broken UI)
 *  - Check fails     → hard redirect to /unsupported (no back-navigation trap)
 *  - Check passes    → renders children normally
 *  - On /unsupported → always renders children (prevents redirect loops)
 */

import { startTransition, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isBrowserSupported } from "./browser-checks";

interface BrowserGuardProps {
  children: React.ReactNode;
}

export function BrowserGuard({ children }: BrowserGuardProps) {
  const pathname = usePathname();

  // Never gate the unsupported page — would cause an infinite redirect loop.
  // Also skip for any internal Next.js paths.
  const shouldSkip = pathname === "/unsupported" || pathname.startsWith("/_next");

  const [ready, setReady] = useState(shouldSkip);

  useEffect(() => {
    if (shouldSkip) return;

    if (!isBrowserSupported()) {
      // replace() instead of push() so the user cannot press Back and
      // return to the broken app.
      window.location.replace("/unsupported");
      return;
    }

    // startTransition marks this as a non-urgent update, avoiding
    // the "setState in effect causes cascading renders" pattern.
    startTransition(() => setReady(true));
  }, [shouldSkip]);

  // Render nothing while the check runs or while the redirect fires.
  // This prevents a flash of broken Tailwind v4 CSS in old browsers.
  if (!ready) return null;

  return <>{children}</>;
}
