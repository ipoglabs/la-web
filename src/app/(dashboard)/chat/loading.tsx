import { LaSkeleton } from "@/components/la";

// Covers the gap while the server component awaits getSession()/getVerificationStatus()
// — ChatPageClient itself already skeletons its conversation list once mounted, this
// just mirrors the same shell so there's no blank flash before that.
export default function ChatLoading() {
  return (
    <div className="h-[calc(100dvh-4.0625rem)] flex overflow-hidden bg-white">
      <div className="flex flex-col w-full shrink-0 md:w-85 md:border-r md:border-slate-100">
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 shrink-0 space-y-3">
          <LaSkeleton shape="text" className="h-6 w-28" />
          <LaSkeleton shape="block" className="h-9 w-full rounded-xl" />
        </div>

        <div className="flex-1 overflow-hidden divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <LaSkeleton shape="circle" className="size-10 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <LaSkeleton shape="text" className="w-1/3" />
                  <LaSkeleton shape="text" className="h-3 w-10" />
                </div>
                <LaSkeleton shape="text" className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block flex-1" />
    </div>
  );
}
