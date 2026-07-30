import { LaSkeleton } from "@/components/la";

export default function DonationHistoryLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-screen-md mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <LaSkeleton shape="text" className="h-7 w-48" />
          <LaSkeleton shape="text" className="h-4 w-32" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="space-y-2">
                  <LaSkeleton shape="text" className="h-5 w-24" />
                  <LaSkeleton shape="text" className="h-3 w-20" />
                </div>
                <LaSkeleton shape="text" className="h-5 w-20 rounded-full" />
              </div>
              <div className="px-4 py-3 space-y-3">
                <div className="flex justify-between items-center">
                  <LaSkeleton shape="text" className="w-16" />
                  <LaSkeleton shape="text" className="w-28" />
                </div>
                <div className="flex justify-between items-center">
                  <LaSkeleton shape="text" className="w-24" />
                  <LaSkeleton shape="text" className="w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
