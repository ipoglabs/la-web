"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "High Price", value: "price_desc" },
  { label: "Low Price", value: "price_asc" },
];

export default function SortDropdown() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = sp.get("sort") || "newest";

  function setSort(value: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("sort", value);
    params.set("page", "1"); // reset to page 1 on sort change
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="text-sm">
      <span>Sort by: </span>
      <div className="min-w-24 dropdown inline-block relative">
        <button
          type="button"
          className="relative w-full inline-flex items-center text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-400 rounded-full px-3 pb-1 pt-[2px]"
        >
          {SORT_OPTIONS.find(o => o.value === current)?.label ?? "Newest"}
          <svg className="absolute top-1.5 right-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
          </svg>
        </button>

        <ul className="hidden min-w-full dropdown-menu absolute bg-gray-200 text-gray-700 shadow-lg">
          {SORT_OPTIONS.map(o => (
            <li key={o.value} className="hover:bg-gray-400">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="block px-4 py-1 whitespace-nowrap cursor-pointer" onClick={() => setSort(o.value)}>
                {o.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
