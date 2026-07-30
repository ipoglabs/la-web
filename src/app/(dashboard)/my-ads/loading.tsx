import { LaSkeleton } from "@/components/la";

export default function MyAdsLoading() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <LaSkeleton shape="text" className="h-7 w-32" />
        <LaSkeleton shape="block" className="h-9 w-28" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
            <LaSkeleton shape="block" className="size-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <LaSkeleton shape="text" className="w-1/2" />
              <LaSkeleton shape="text" className="w-1/3" />
              <LaSkeleton shape="text" className="w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
