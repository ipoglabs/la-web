import LaDevClient from "./LaDevClient";

/**
 * /la-dev — user lookup + permanent delete, so a test account's email/phone
 * can be freed up (unique indexes) to re-run the registration flow.
 * Basic-Auth gated in proxy.ts like /design-system and /snippets — that's
 * the only gate, same as those routes (no NODE_ENV block, since Vercel's
 * "production" target here is staging.lokalads.com, not a separate
 * public-facing site).
 */
export default function LaDevPage() {
  return <LaDevClient />;
}
