// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href="/admin/users" className="p-6 bg-white rounded shadow">
        👤 Manage Users
      </Link>
      <Link href="/admin/posts" className="p-6 bg-white rounded shadow">
        📢 Manage Ads
      </Link>
    </div>
  );
}
