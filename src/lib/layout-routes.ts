/**
 * Route lists shared between proxy.ts (server, sets x-simple-layout) and
 * AppHeader (client, reads usePathname()) — see CLAUDE.md's "Layout signal
 * system" note: a server-read header is frozen after first paint, so
 * next/link soft navigation into these routes wouldn't otherwise flip the
 * header variant without a hard refresh. AppHeader re-checks the pathname
 * itself on every client render so it self-corrects with no reload needed.
 */
export const SIMPLE_LAYOUT_ROUTES = ["/login", "/register", "/signup"];

export function isSimpleLayoutRoute(pathname: string): boolean {
  return SIMPLE_LAYOUT_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}
