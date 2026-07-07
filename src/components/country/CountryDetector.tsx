"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import {
  isAllowedCountry,
  IPINFO_URL,
  DETECTION_TIMEOUT,
} from "@/lib/country-context";
import { commitCountry, commitBlockedCountry } from "@/lib/country-cookie";
import { OverlayCountrySelect } from "@/components/overlay-country-select";

export function CountryDetector() {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DETECTION_TIMEOUT);

    fetch(IPINFO_URL, { signal: controller.signal })
      // TODO(scale): ipinfo.io free tier is capped at 50k req/month.
      //   For production, use a paid ipinfo plan or self-host a GeoIP db (e.g. MaxMind GeoLite2).
      //   Alternative: rely on CF header exclusively and remove this client fetch entirely.
      .then((r) => r.json())
      .then((data: { country?: string }) => {
        clearTimeout(timeout);
        const code = data?.country?.toUpperCase() ?? "";
        if (isAllowedCountry(code)) {
          // Allowed country — commit and refresh into the app
          commitCountry(code);
          // TODO(API): When auth is integrated, also POST country to backend session:
          //   fetch("/api/user/preferences", { method: "POST", body: JSON.stringify({ country: code }) })
          //   This ensures the server session stays in sync with the cookie.
          router.refresh();
        } else {
          // Detected but not served — store code and show contextual picker
          if (code) {
            commitBlockedCountry(code);
            setDetectedCountry(code);
          }
          setShowPicker(true);
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        // Fetch failed or timed out — show plain picker (no detected country)
        setShowPicker(true);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [router]);

  // Picker — passes detectedCountry to show contextual banner when available
  if (showPicker) {
    return <OverlayCountrySelect detectedCountry={detectedCountry} />;
  }

  // Loading state while IP detection is in progress
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3">
      <Globe className="w-10 h-10 text-muted-foreground animate-pulse" />
      <p className="text-sm text-muted-foreground">Detecting your region&hellip;</p>
    </div>
  );
}
