import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

function isAdminRole(role?: string) {
  return ["super_admin", "admin", "moderator", "support", "analyst"].includes(String(role));
}

function hasPerm(role: string, perm: string) {
  // basic mapping for now (we can improve later)
  const r = String(role);

  if (r === "super_admin") return true;

  if (perm === "users.manage") return r === "admin" || r === "moderator";
  if (perm === "posts.manage") return r === "admin" || r === "moderator" || r === "analyst";

  if (perm === "comm.manage") return r === "support" || r === "moderator" || r === "admin" || r === "super_admin";

  return false;
}

export default function AdminDashboard() {
  const token = cookies().get("session")?.value || "";
  const decoded: any = token ? verifyToken(token) : null;

  const role = decoded?.role;

  if (!decoded || !isAdminRole(role)) {
    // layout/middleware already redirects; this is just safety
    return null;
  }

  return (
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

      {/* Super Admin only */}
      {String(role) === "super_admin" && (
        <Link href="/admin/register" className="p-6 bg-white rounded shadow hover:bg-slate-50">
          🛡️ Create Admin Accounts
        </Link>
      )}
    </div>
  );
}
