import Link from "next/link";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE, isSupportedCountry } from "@/lib/country-context";
import { COUNTRIES } from "@/lib/data/countries";
import { ResetButton } from "@/components/country/ResetButton";

export default async function CountryContextPocPage() {
  const jar = await cookies();
  const raw = jar.get(COUNTRY_COOKIE)?.value ?? "";
  const code = isSupportedCountry(raw) ? raw : null;
  const country = COUNTRIES.find((c) => c.code === code);

  return (
    <div className="flex flex-1 items-start justify-center">
      <div className="w-full max-w-lg px-6 py-20">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          ← Home
        </Link>

        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
            POC · Country Context
          </p>
          <h1 className="text-4xl font-extrabold font-display text-foreground leading-tight tracking-tight">
            Country Detection
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Demonstrates IP-based auto-detection with a manual fallback. Country is stored
            in a cookie and enforced globally — no route is accessible until it resolves.
          </p>
        </div>

        {country ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-4">
                Detected Country
              </p>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{country.flag}</span>
                <div>
                  <p className="text-2xl font-bold text-foreground">{country.name}</p>
                  <p className="text-sm font-mono text-muted-foreground mt-0.5">
                    ISO code: <span className="text-foreground font-semibold">{country.code}</span>
                    <span className="mx-2 text-muted-foreground/30">·</span>
                    Dial: <span className="text-foreground font-semibold">{country.dial}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 px-5 py-4">
              <p className="text-xs font-mono text-muted-foreground">
                Cookie: <span className="text-foreground font-semibold">countryContext={country.code}</span>
                <span className="mx-2 text-muted-foreground/30">·</span>
                Expires in 30 days
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <ResetButton />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">No country detected — should not happen if middleware is running.</p>
          </div>
        )}

      </div>
    </div>
  );
}
