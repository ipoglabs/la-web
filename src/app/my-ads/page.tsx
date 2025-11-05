// src/app/my-ads/page.tsx
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientList from "./ClientList";
import { getMyPosts } from "@/app/actions/getMyPosts";
import { verifyToken } from "@/lib/auth";

function extractEmailFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  return (
    decoded.email ||
    decoded.user?.email ||
    (typeof decoded.sub === "string" && decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

function extractUserIdFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  // Typical places an id can live
  return (
    decoded.id ||
    decoded.userId ||
    decoded.user?.id ||
    (typeof decoded.sub === "string" && !decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

export default async function MyAdsPage() {
  const cookieStore = cookies();
  const hdrs = headers();

  // Prefer cookie, but also gracefully accept Authorization header if you use it
  let raw = cookieStore.get("token")?.value || hdrs.get("authorization") || "";
  if (raw?.startsWith("Bearer ")) raw = raw.slice("Bearer ".length).trim();

  const decoded = raw ? verifyToken(raw) : null;
  const email = extractEmailFromDecoded(decoded);
  const ownerId = extractUserIdFromDecoded(decoded);

  // Not logged in (neither ownerId nor email present)
  if (!ownerId && !email) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Ads</h1>
          <Link href="/post/select-category">
            <Button>New Post</Button>
          </Link>
        </div>

        <div className="border rounded-md p-4 text-slate-700 bg-slate-50">
          You are not logged in or your session expired.
          <br />
          <span className="text-sm">
            Please{" "}
            <Link href="/login" className="underline">
              log in
            </Link>{" "}
            again.
          </span>

          {/* Dev-only diagnostics; remove in production */}
          <details className="mt-3 text-xs text-slate-500">
            <summary>Debug (dev only)</summary>
            <pre>Has token: {String(Boolean(raw))}</pre>
            <pre>JWT verified: {String(Boolean(decoded))}</pre>
            <pre>email: {email || "—"}</pre>
            <pre>ownerId: {ownerId || "—"}</pre>
          </details>
        </div>
      </main>
    );
  }

  // Fetch posts by ownerId (preferred), fallback to email
  // TIP: Update action signature to: getMyPosts({ ownerId?: string; email?: string })
  const rows = await getMyPosts({ ownerId, email });

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Ads</h1>
        <Link href="/post/select-category">
          <Button>New Post</Button>
        </Link>
      </div>

      {(!rows || rows.length === 0) ? (
        <p className="text-slate-600">
          No ads found{email ? <> for <b>{email}</b></> : null}.{" "}
          <Link href="/post/select-category" className="underline">
            Create your first ad
          </Link>
          .
        </p>
      ) : (
        <ClientList
          initialRows={rows}
          ownerEmail={email}
          ownerId={ownerId}
        />
      )}
    </main>
  );
}
