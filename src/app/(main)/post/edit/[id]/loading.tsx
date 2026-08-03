import { LaSkeleton } from "@/components/la";

// Covers the gap while the server component awaits getPostById(id) — this
// route immediately redirects into the post wizard once hydrated, so this
// only needs to hold the shape of a form page for a moment, not match it exactly.
export default function EditPostLoading() {
  return (
    <main className="min-h-screen bg-[#eaeff5]">
      <div className="mx-auto max-w-xl px-4 pb-16 pt-5 sm:px-6 space-y-4">
        <LaSkeleton shape="text" className="h-7 w-48" />

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <LaSkeleton shape="block" className="aspect-4/3 w-full" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <LaSkeleton shape="text" className="h-5 w-32" />
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
