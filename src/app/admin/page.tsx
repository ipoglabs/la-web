import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminJwt, isAdminRole } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

function hasPerm(role: string, perm: string) {
  if (role === "super_admin") return true;

  if (perm === "users.manage") return role === "admin" || role === "moderator";
  if (perm === "posts.manage") return role === "admin" || role === "moderator" || role === "analyst";
  if (perm === "comm.manage") return role === "support" || role === "moderator" || role === "admin";

  return false;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { created?: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value || "";

  const session = token ? verifyAdminJwt(token) : null;
  if (!session || !isAdminRole(session.role)) {
    redirect("/admin/login?next=/admin");
  }

  const role = session.role;
  const created = searchParams?.created === "1";

  return (
    <div className="space-y-4">
      {created && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          ✅ Admin account created successfully
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasPerm(role, "users.manage") && (
          <Link href="/admin/users" className="p-6 bg-white rounded shadow hover:bg-slate-50">
            👤 Manage Users
          </Link>
        )}

        {hasPerm(role, "posts.manage") && (
          <Link href="/admin/posts" className="p-6 bg-white rounded shadow hover:bg-slate-50">
            📢 Manage Ads
          </Link>
        )}

        {hasPerm(role, "comm.manage") && (
          <Link href="/admin/communications" className="p-6 bg-white rounded shadow hover:bg-slate-50">
            💬 User Communication
          </Link>
        )}

        {role === "super_admin" && (
          <Link href="/admin/register" className="p-6 bg-white rounded shadow hover:bg-slate-50">
            🛡️ Create Admin Accounts
          </Link>
        )}
      </div>
    </div>
  );
}
