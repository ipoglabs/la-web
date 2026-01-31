import { cookies } from "next/headers";
import { verifyAdminJwt, ADMIN_COOKIE } from "@/lib/adminAuth";

export default async function AdminProfilePage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value || "";
  const session = token ? verifyAdminJwt(token) : null;

  if (!session) return null;

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">My Profile</h1>

      <div className="space-y-2 text-sm">
        <div>Email: <b>{session.email}</b></div>
        <div>Role: <b className="capitalize">{session.role.replace("_", " ")}</b></div>
        <div>Country: <b>{session.country || "-"}</b></div>
      </div>
    </div>
  );
}
