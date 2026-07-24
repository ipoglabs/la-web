// ── Email Preview API Route ───────────────────────────────────────────────────
// GET /api/email-preview?index=N
// Returns rendered HTML for one email template using mock data.
// Used exclusively by the /design-system/feature/email-engine demo page
// so that react-dom/server never enters the Server Component import chain.

import { renderEmail } from "@/lib/email/renderer";
import { PREVIEW_DATA } from "@/lib/email/preview-data";

export function GET(request: Request) {
  // Dev-only endpoint — returns 404 in production so it cannot be crawled or abused
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const index = parseInt(searchParams.get("index") ?? "0", 10);

  if (isNaN(index) || index < 0 || index >= PREVIEW_DATA.length) {
    return new Response("Not found", { status: 404 });
  }

  const { html } = renderEmail(PREVIEW_DATA[index].event);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Prevent the browser from sniffing a different MIME type
      "X-Content-Type-Options": "nosniff",
      // No caching needed — this is a local dev demo endpoint
      "Cache-Control": "no-store",
    },
  });
}
