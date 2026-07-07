import { TermsResponsiveDialog } from "@/components/responsive-dialog/TermsDrawer";

export default function ResponsiveDialogPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-sm text-center space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            You must accept our terms before continuing.
          </p>
        </div>
        <TermsResponsiveDialog />
      </div>
    </main>
  );
}
