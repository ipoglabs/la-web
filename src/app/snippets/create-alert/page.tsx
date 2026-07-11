"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { CreateAlertBanner, CreateAlertDialog } from "@/components/create-alert";
import { LaButton } from "@/components/la";
import type { AlertPayload } from "@/components/create-alert";

export default function CreateAlertSnippetPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastPayload, setLastPayload] = useState<AlertPayload | null>(null);

  const handleAlertCreated = (payload: AlertPayload) => {
    setLastPayload(payload);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-5 py-16 space-y-12">

        {/* Page header */}
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Snippet</p>
          <h1 className="text-2xl font-bold text-slate-900">Create Alert</h1>
          <p className="mt-1 text-sm text-slate-500">
            Journey component — category picker → filters → confirmation.
            Bottom sheet on mobile, dialog on tablet+.
          </p>
        </div>

        {/* Banner (primary use-case) */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Banner trigger</p>
          <CreateAlertBanner onAlertCreated={handleAlertCreated} />
        </section>

        {/* Standalone button trigger */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Button trigger</p>
          <LaButton
            type="button"
            intent="ghost"
            size="big"
            iconOnly
            className="hover:bg-rose-50 focus-visible:ring-rose-400 [&_svg]:size-6"
            onClick={() => setDialogOpen(true)}
            aria-label="Create a new alert"
          >
            <Bell className="h-5 w-5 text-rose-500" fill="currentColor" strokeWidth={0} />
          </LaButton>
          <CreateAlertDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleAlertCreated}
          />
        </section>

        {/* Last created alert preview */}
        {lastPayload && (
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Last created alert</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">
                {lastPayload.mainCategory.label} &rarr; {lastPayload.subCategory.label}
              </p>
              <div className="space-y-1 text-xs text-slate-500 font-mono">
                {lastPayload.keywords.length > 0 && <p>keywords: [{lastPayload.keywords.join(", ")}]</p>}
                {lastPayload.location && <p>location: {lastPayload.location.label}</p>}
                {(Object.entries(lastPayload.filterValues) as [string, string[]][]).map(([id, vals]) =>
                  vals.length > 0 ? <p key={id}>{id}: [{vals.join(", ")}]</p> : null
                )}
                {lastPayload.keywords.length === 0 && !lastPayload.location && (Object.values(lastPayload.filterValues) as string[][]).every(v => v.length === 0) && (
                  <p className="text-slate-400">No filters set — watching all {lastPayload.subCategory.label} listings</p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                {lastPayload.notifyChannels.map((ch: string) => (
                  <span key={ch} className="text-xs bg-white border border-slate-200 rounded-full px-2.5 py-0.5 text-slate-600 capitalize">{ch}</span>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
