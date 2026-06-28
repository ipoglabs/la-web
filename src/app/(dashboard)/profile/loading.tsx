export default function ProfileLoading() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-xl mx-auto px-4 pb-10 flex flex-col gap-6">

        {/* Avatar hero skeleton */}
        <div className="flex items-center gap-3.5 pt-5 pb-1">
          <div className="size-14 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Section skeletons — mirrors the real page structure */}
        {[
          { label: "Public Profile", rows: 1 },
          { label: "Basic Info",     rows: 3 },
          { label: "Contact",        rows: 3 },
          { label: "Location",       rows: 4 },
          { label: "Settings",       rows: 2 },
        ].map((s, i) => (
          <div key={i}>
            {/* Section label */}
            <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse mb-2 ml-1" />

            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              {Array.from({ length: s.rows }).map((_, r) => (
                <div
                  key={r}
                  className="px-4 py-3.5 border-b border-slate-100 last:border-0 flex flex-col gap-1.5"
                >
                  <div className="h-2.5 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3.5 w-48 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}
