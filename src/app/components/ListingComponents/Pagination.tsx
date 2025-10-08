"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ total, pageSize }: { total: number; pageSize: number }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(1, Number(sp.get("page") || "1"));
  const pages = Math.max(1, Math.ceil(total / pageSize));

  function go(p: number) {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  const items = [];
  const show = 5; // compact
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + show - 1);

  for (let i = start; i <= end; i++) {
    items.push(
      <button key={i}
        onClick={() => go(i)}
        className={`size-7 rounded-md text-sm ${i === page ? "bg-slate-800 text-slate-100" : "bg-slate-300 hover:bg-slate-100 text-slate-900"}`}>
        {i}
      </button>
    );
  }

  if (pages <= 1) return null;

  return (
    <div className="w-full mt-3 flex items-center">
      <div className="mx-auto py-2 space-x-1">
        <button onClick={() => go(Math.max(1, page - 1))}
                className="h-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900 px-2">
          back
        </button>
        {items}
        {end < pages && <span className="px-1">…</span>}
        {end < pages && (
          <button onClick={() => go(pages)} className="size-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900">
            {pages}
          </button>
        )}
        <button onClick={() => go(Math.min(pages, page + 1))}
                className="h-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900 px-2">
          next
        </button>
      </div>
    </div>
  );
}
