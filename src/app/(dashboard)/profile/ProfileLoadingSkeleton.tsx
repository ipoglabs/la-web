import { LaSkeleton } from "@/components/la";

export function ProfileLoadingSkeleton({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-[#eaeff5]">
      <div className="mx-auto max-w-xl px-4 pb-16 pt-5 sm:px-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
          <div className="flex items-center gap-3">
            <LaSkeleton shape="circle" className="size-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <LaSkeleton shape="text" className="w-1/2" />
              <LaSkeleton shape="text" className="w-1/3" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <LaSkeleton shape="text" className="h-5 w-40" />
          <LaSkeleton shape="text" className="w-full" />
          <LaSkeleton shape="text" className="w-2/3" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <LaSkeleton shape="text" className="h-5 w-40" />
          <LaSkeleton shape="text" className="w-full" />
          <LaSkeleton shape="text" className="w-1/2" />
        </div>
      </div>
    </main>
  );
}
