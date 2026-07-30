import { LaSkeleton } from "@/components/la";

export default function PublicProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="rounded-xl border border-slate-300 bg-white p-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <LaSkeleton shape="circle" className="size-20 shrink-0" />
          <div className="w-full flex-1 space-y-2">
            <LaSkeleton shape="text" className="mx-auto h-6 w-48 sm:mx-0" />
            <LaSkeleton shape="text" className="mx-auto w-32 sm:mx-0" />
            <LaSkeleton shape="text" className="mx-auto w-40 sm:mx-0" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg overflow-hidden bg-white">
            <LaSkeleton shape="block" className="aspect-4/3 rounded-none" />
            <div className="p-2 space-y-2">
              <LaSkeleton shape="text" className="w-2/5" />
              <LaSkeleton shape="text" className="w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
