import DevToolsClient from "./DevToolsClient";

/**
 * /dev-tools — user lookup, deleted-user inspection, and audit history.
 * Permanent account deletion lives in /admin → Users instead (real admin
 * session gate, not shared Basic Auth — see actions/admin/hardDeleteUser.ts).
 * Basic-Auth gated in proxy.ts like /design-system and /snippets — that's
 * the only gate, same as those routes (no NODE_ENV block, since Vercel's
 * "production" target here is staging.lokalads.com, not a separate
 * public-facing site).
 */
export default function DevToolsPage() {
  return <DevToolsClient />;
}
