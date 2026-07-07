/**
 * browser-checks.ts
 *
 * Pure feature-detection functions — no User-Agent sniffing.
 * Tests the actual rendering capabilities required by this stack:
 *   - Tailwind CSS v4  → container queries, :where(), oklch colors
 *   - React 19         → structuredClone
 *   - Next.js 16       → ES2017+ (async/await, Object.entries, etc.)
 *
 * Safe to call in any environment — returns true (pass) in SSR/Edge contexts
 * where `window` and `CSS` are unavailable.
 */

export interface BrowserCheck {
  /** Human-readable label for the check */
  label: string;
  /** true = browser supports this feature */
  pass: boolean;
}

export function runBrowserChecks(): BrowserCheck[] {
  // Not in a browser (SSR / Edge runtime) — let it through, client will re-check
  if (typeof window === "undefined" || typeof CSS === "undefined" || !CSS.supports) {
    return [];
  }

  return [
    {
      label: "CSS container queries",
      pass: CSS.supports("container-type: inline-size"),
    },
    {
      label: "CSS :where() selector",
      pass: CSS.supports("selector(:where(a))"),
    },
    {
      label: "CSS oklch() color function",
      pass: CSS.supports("color: oklch(0% 0 0)"),
    },
    {
      label: "CSS cascade layers (@layer)",
      pass: CSS.supports("@layer base {}") || typeof CSSLayerStatementRule !== "undefined",
    },
    {
      label: "structuredClone (React 19)",
      pass: typeof structuredClone !== "undefined",
    },
    {
      label: "ES2020 — optional chaining",
      // If the browser couldn't even parse this file we'd never get here,
      // but this guards browsers that partially parsed without executing.
      pass: (() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (({} as any)?.x) === undefined;
        } catch {
          return false;
        }
      })(),
    },
  ];
}

/** Returns true when ALL checks pass (or when called outside a browser). */
export function isBrowserSupported(): boolean {
  const checks = runBrowserChecks();
  if (checks.length === 0) return true; // SSR — always allow
  return checks.every((c) => c.pass);
}

/** Returns the list of failed check labels, or an empty array when all pass. */
export function getFailedChecks(): string[] {
  return runBrowserChecks()
    .filter((c) => !c.pass)
    .map((c) => c.label);
}
