// src/app/admin/layout.tsx
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const hdrs = headers();

  let raw =
    cookieStore.get("session")?.value ||
    hdrs.get("authorization") ||
    "";

  if (raw?.startsWith("Bearer ")) raw = raw.slice("Bearer ".length).trim();

  let decoded: any = null;
  try {
    decoded = raw ? verifyToken(raw) : null;
  } catch {
    decoded = null;
  }

  // ✅ IMPORTANT: check role from token payload
  const role = decoded?.role;

  if (!decoded || role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b font-semibold">
        Admin Panel
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
