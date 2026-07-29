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

/**
 * Routes that manage their own full-height, self-contained layout (a fixed
 * header/list/composer app shell, not a normally-scrolling page) and so must
 * never get AppFooter stacked below them — the extra footer height pushes
 * the page taller than one viewport, forcing a scroll to reach content
 * (e.g. chat's message composer) that's meant to always be visible.
 */
export const NO_FOOTER_ROUTES = ["/chat"];

export function isNoFooterRoute(pathname: string): boolean {
  return NO_FOOTER_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}
