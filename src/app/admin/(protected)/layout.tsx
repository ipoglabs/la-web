import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* <header className="px-6 py-4 bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-semibold">Admin Panel</div>

          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin" className="text-blue-600 underline">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-blue-600 underline">
              Users
            </Link>
            <Link href="/admin/posts" className="text-blue-600 underline">
              Ads
            </Link>
          </div>
        </div>
      </header> */}

      <main className="p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
