import { LaSkeleton } from "@/components/la";

// Shown while /post checks the session and verification status before
// redirecting to the first wizard step — instead of a blank page. Lives in
// the (start) route group so it covers only /post, not the wizard steps.
export default function PostStartLoading() {
  return (
    <main className="min-h-screen bg-slate-50" aria-busy="true">
      <div className="mx-auto max-w-xl px-4 pb-16 pt-10 sm:px-6 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <LaSkeleton shape="text" className="h-8 w-56" />
          <LaSkeleton shape="text" className="w-72" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <LaSkeleton key={i} shape="block" className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <p className="text-center text-sm text-slate-600" role="status">
          Getting your post form ready…
        </p>
      </div>
    </main>
  );
}
