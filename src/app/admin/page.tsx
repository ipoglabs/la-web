import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import AdminTabs from "./AdminTabs";

export const dynamic = "force-dynamic";

/**
 * /admin — the real (non-dev-tools) admin surface: approve/reject/pending/ban
 * any post. Gated on the actual session, not proxy.ts Basic Auth, since
 * this is reachable by any signed-in visitor — see lib/admin.ts for how
 * "admin" is decided (a fixed verified-email allowlist, not the
 * self-declared User.publicRole field).
 *
 * Anyone who isn't that exact admin is redirected away before anything
 * here renders — no "not logged in" / "no access" shell to reveal that
 * this route exists.
 */
export default async function AdminPage() {
  const session = await getAuthUser();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Admin</h1>
      <p className="text-sm text-slate-500 mb-6">
        Every post on the marketplace — set its status to approve, reject, hold as pending, or ban it.
        Reported ads land in Reports for review.
      </p>
      <AdminTabs />
    </main>
  );
}
