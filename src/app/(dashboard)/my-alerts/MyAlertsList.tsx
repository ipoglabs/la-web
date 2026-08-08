"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Mail, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  LaCard,
  LaBadge,
  LaButton,
  LaSwitch,
  LaAlertDialog,
  LaAlertDialogContent,
  LaAlertDialogHeader,
  LaAlertDialogFooter,
  LaAlertDialogMedia,
  LaAlertDialogTitle,
  LaAlertDialogDescription,
  LaAlertDialogAction,
  LaAlertDialogCancel,
} from "@/components/la";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import { CreateAlertDialog, useSubmitAlert } from "@/components/create-alert";
import type { MyAlertRow } from "@/app/actions/alerts/getMyAlerts";
import { deleteAlert } from "@/app/actions/alerts/deleteAlert";
import { toggleAlertActive } from "@/app/actions/alerts/toggleAlertActive";

const FREQUENCY_LABEL: Record<MyAlertRow["frequency"], string> = {
  instant: "Instant",
  daily: "Daily digest",
  weekly: "Weekly digest",
};

function priceRangeLabel(min?: number, max?: number): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
  if (min != null) return `From ₹${min.toLocaleString()}`;
  return `Up to ₹${max?.toLocaleString()}`;
}

function AlertRow({
  alert,
  onToggled,
  onDeleted,
}: {
  alert: MyAlertRow;
  onToggled: (id: string, isActive: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const priceLabel = priceRangeLabel(alert.priceMin, alert.priceMax);

  async function handleToggle(next: boolean) {
    setBusy(true);
    const prev = alert.isActive;
    onToggled(alert.id, next); // optimistic
    const result = await toggleAlertActive(alert.id, next);
    setBusy(false);
    if (!result.ok) {
      onToggled(alert.id, prev); // revert
      toast.error(result.error || "Couldn't update alert.");
    }
  }

  async function handleDelete() {
    setBusy(true);
    const result = await deleteAlert(alert.id);
    setBusy(false);
    if (result.ok) {
      toast.success(`"${alert.name}" deleted.`);
      onDeleted(alert.id);
    } else {
      toast.error(result.error || "Couldn't delete alert.");
    }
    setConfirmingDelete(false);
  }

  return (
    <LaCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900">{alert.name}</p>
            <LaBadge intent={alert.isActive ? "success" : "neutral"} variant="soft">
              {alert.isActive ? "Active" : "Paused"}
            </LaBadge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {alert.categoryLabel}
            {alert.subCategoryLabel ? ` / ${alert.subCategoryLabel}` : ""}
            {alert.location ? ` · ${alert.location}` : ""}
            {priceLabel ? ` · ${priceLabel}` : ""}
          </p>
          {alert.keywords.length > 0 && (
            <p className="text-sm text-slate-500 mt-0.5">Keywords: {alert.keywords.join(", ")}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Bell className="size-3.5" /> {FREQUENCY_LABEL[alert.frequency]}
            </span>
            {alert.notifyVia.includes("email") && (
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3.5" /> Email
              </span>
            )}
            {alert.notifyVia.includes("whatsapp") && (
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="size-3.5" /> WhatsApp
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {alert.lastNotifiedAt ? (
              <>Last notified <LaRelativeDate value={alert.lastNotifiedAt} /></>
            ) : alert.noMatchSince ? (
              <>No matches since <LaRelativeDate value={alert.noMatchSince} /></>
            ) : (
              <>Created <LaRelativeDate value={alert.createdAt} /> — no notifications yet</>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <LaSwitch checked={alert.isActive} onCheckedChange={handleToggle} disabled={busy} />
          <LaButton
            intent="ghost"
            size="compact"
            iconOnly
            disabled={busy}
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete alert"
          >
            <Trash2 className="size-4 text-rose-600" />
          </LaButton>
        </div>
      </div>

      <LaAlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <LaAlertDialogContent size="sm">
          <LaAlertDialogHeader>
            <LaAlertDialogMedia>
              <Trash2 className="size-5 text-rose-500" />
            </LaAlertDialogMedia>
            <LaAlertDialogTitle>Delete this alert?</LaAlertDialogTitle>
            <LaAlertDialogDescription>
              You&apos;ll stop getting notified about new matches for &quot;{alert.name}&quot;. This can&apos;t be undone.
            </LaAlertDialogDescription>
          </LaAlertDialogHeader>
          <LaAlertDialogFooter>
            <LaAlertDialogCancel disabled={busy}>Cancel</LaAlertDialogCancel>
            <LaAlertDialogAction intent="danger" onClick={handleDelete} disabled={busy}>
              Delete
            </LaAlertDialogAction>
          </LaAlertDialogFooter>
        </LaAlertDialogContent>
      </LaAlertDialog>
    </LaCard>
  );
}

export default function MyAlertsList({ initialAlerts }: { initialAlerts: MyAlertRow[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const baseSubmitAlert = useSubmitAlert();

  // Re-sync when the server component re-fetches (see router.refresh() below)
  // — a plain useState initializer won't pick up a new `initialAlerts` prop.
  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);

  async function submitAlert(payload: Parameters<typeof baseSubmitAlert>[0]) {
    await baseSubmitAlert(payload);
    router.refresh();
  }

  function handleToggled(id: string, isActive: boolean) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isActive } : a)));
  }

  function handleDeleted(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LaButton intent="primary-blue" onClick={() => setCreateOpen(true)}>
          Create alert
        </LaButton>
      </div>

      {alerts.length === 0 ? (
        <p className="text-sm text-slate-500 p-4">
          No saved alerts yet. Create one to get notified when a matching ad is posted.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onToggled={handleToggled} onDeleted={handleDeleted} />
          ))}
        </div>
      )}

      <CreateAlertDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={submitAlert} />
    </div>
  );
}
