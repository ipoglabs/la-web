import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { BACK_OFFICE_URL } from "@/lib/admin";
import AdminOptionRequestsPanel from "./AdminOptionRequestsPanel";

export const dynamic = "force-dynamic";

/**
 * /admin — retired. Moderation (ads, reports, users, option requests) lives in
 * the back office (lokalads-bo), where every decision is tied to a named staff
 * member in the audit log. Everything here redirects there.
 *
 * One tool stays, at /admin?tab=options: adding a seller's value to a post
 * form that isn't in the database yet. la-web serves such forms from its code
 * defaults, which the back office doesn't have, so its Options page sends
 * those cases here.
 *
 * Gated on the real session (lib/admin.ts: a fixed verified-email allowlist).
 * Anyone else is redirected away before anything renders.
 */
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getAuthUser();

  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent("/admin?tab=options")}`);
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  if ((await searchParams).tab !== "options") {
    redirect(`${BACK_OFFICE_URL}/bo`);
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Option requests (forms not in the database)</h1>
      <p className="text-sm text-slate-500 mb-6">
        Moderation has moved to the{" "}
        <a href={`${BACK_OFFICE_URL}/bo`} className="underline">
          back office
        </a>
        . Use this page only when the back office&apos;s Options page says a form isn&apos;t in the database yet.
      </p>
      <AdminOptionRequestsPanel />
    </main>
  );
}
