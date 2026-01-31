import { cookies } from "next/headers";
import { verifyAdminJwt, ADMIN_COOKIE, isAdminRole } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminHeader from "./components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value || "";

  const session = token ? verifyAdminJwt(token) : null;
  if (!session || !isAdminRole(session.role)) {
    redirect("/admin/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-semibold">Admin Panel</div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-blue-600 underline">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-blue-600 underline">
              Users
            </Link>
            <Link href="/admin/posts" className="text-blue-600 underline">
              Ads
            </Link>

            {/* Profile dropdown */}
            <AdminHeader
              name={`${session.email.split("@")[0]}`}
              email={session.email}
              role={session.role}
            />
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
