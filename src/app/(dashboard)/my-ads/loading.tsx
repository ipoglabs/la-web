import { LaSkeleton } from "@/components/la";

export default function MyAdsLoading() {
  return (
    <div className="container-app py-6 sm:py-8">
      <LaSkeleton shape="text" className="h-7 w-40 mb-1" />
      <LaSkeleton shape="text" className="h-5 w-72 mb-6" />

      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <LaSkeleton key={i} shape="block" className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="max-w-2xl space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-400 p-4">
            <LaSkeleton shape="block" className="size-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <LaSkeleton shape="text" className="w-1/2" />
              <LaSkeleton shape="text" className="w-1/3" />
              <LaSkeleton shape="text" className="w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
