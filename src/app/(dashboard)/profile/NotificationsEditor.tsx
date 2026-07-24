"use client";

/**
 * NotificationsEditor — notification preference toggles (activity +
 * marketing). Split out of page.tsx (Golden Rule file-size split,
 * 2026-07-14).
 *
 * Exports NotificationPrefs + NOTIFICATION_PREF_KEYS since ProfilePage's
 * Account Settings row subtitle (`N of 4 on`) also needs them.
 */

import { useEffect, useState } from "react";
import { LaSwitch } from "@/components/la";
import { ResponsiveEditor } from "./ResponsiveEditor";

export interface NotificationPrefs {
  newMessages: boolean;
  listingUpdates: boolean;
  savedSearchAlerts: boolean;
  marketingEmails: boolean;
}

export const NOTIFICATION_PREF_KEYS: (keyof NotificationPrefs)[] = [
  "newMessages",
  "listingUpdates",
  "savedSearchAlerts",
  "marketingEmails",
];

export function NotificationsEditor({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: NotificationPrefs;
  onSave: (next: NotificationPrefs) => void;
}) {
  const [draft, setDraft] = useState<NotificationPrefs>(value);

  useEffect(() => {
    if (open) setDraft(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    // TODO [INTEGRATION]: PATCH /api/profile/notifications
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title="Notification Preferences"
      onSave={handleSave}
    >
      <div className="px-6 py-2">
        <p className="mb-1 mt-3 text-sm font-semibold text-slate-700">Activity</p>
        <div className="divide-y divide-slate-200">
          <LaSwitch
            label="New messages"
            description="Someone messages you about a listing"
            checked={draft.newMessages}
            onCheckedChange={(checked) => setDraft((prev) => ({ ...prev, newMessages: checked }))}
          />
          <LaSwitch
            label="Listing updates"
            description="Status changes on ads you've posted"
            checked={draft.listingUpdates}
            onCheckedChange={(checked) =>
              setDraft((prev) => ({ ...prev, listingUpdates: checked }))
            }
          />
          <LaSwitch
            label="Saved search alerts"
            description="New listings matching your saved searches"
            checked={draft.savedSearchAlerts}
            onCheckedChange={(checked) =>
              setDraft((prev) => ({ ...prev, savedSearchAlerts: checked }))
            }
          />
        </div>
        <p className="mb-1 mt-5 text-sm font-semibold text-slate-700">Marketing</p>
        <div className="divide-y divide-slate-200">
          <LaSwitch
            label="Marketing emails"
            description="Offers, tips, and product news from LokalAds"
            checked={draft.marketingEmails}
            onCheckedChange={(checked) =>
              setDraft((prev) => ({ ...prev, marketingEmails: checked }))
            }
          />
        </div>
      </div>
    </ResponsiveEditor>
  );
}
