"use client";

/**
 * Layout atoms shared across the /profile page's sections: Section (card
 * wrapper + heading), InfoRow (read-only label/value), ContactRow
 * (label/value + edit/remove actions), SettingsRow (tappable settings link).
 * Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 */

import type { ReactNode } from "react";
import { CheckCircle2, ChevronRight, Lock, Trash2 } from "lucide-react";
import { LaBadge, LaButton, LaCard } from "@/components/la";
import { cn } from "@/lib/utils";

export function Section({
  label,
  actionText,
  onActionClick,
  description,
  children,
}: {
  label: string;
  actionText?: string;
  onActionClick?: () => void;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-1">
      <div className="flex items-center justify-between px-1">
        <p className="text-lg font-medium text-slate-900">{label}</p>
        {actionText && (
          <LaButton
            type="button"
            intent="link"
            size="compact"
            onClick={onActionClick}
            className="h-auto rounded-none px-0 py-0 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            {actionText}
          </LaButton>
        )}
      </div>
      {description && (
        <p className="px-1 text-sm text-slate-700">{description}</p>
      )}
      <LaCard className="overflow-hidden">{children}</LaCard>
    </section>
  );
}

export function InfoRow({
  label,
  value,
  subtext,
  subtextHref,
}: {
  label: string;
  value: string;
  subtext?: string;
  /** When provided, renders `subtext` as a link opening in a new tab (e.g. the public profile URL). */
  subtextHref?: string;
}) {
  return (
    <div className="border-b border-slate-200 px-4 py-3.5 last:border-0">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-700">{label}</p>
      <p className="mt-0.5 text-base font-medium text-slate-900">{value}</p>
      {subtext && subtextHref ? (
        <a
          href={subtextHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-block text-sm text-blue-800 underline underline-offset-2 hover:text-blue-900"
        >
          {subtext}
        </a>
      ) : (
        subtext && <p className="mt-0.5 text-sm text-slate-600">{subtext}</p>
      )}
    </div>
  );
}

export function ContactRow({
  label,
  value,
  verified,
  onEdit,
  onRemove,
  editLabel = "Edit",
  icon: Icon,
}: {
  label: string;
  value: string;
  verified?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  /** Set to a non-"Edit" label (e.g. "Locked") to render a muted, clearly-non-interactive affordance instead of a normal action button. */
  editLabel?: string;
  /** Small leading icon before the label, e.g. Mail for Email */
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  const isLocked = editLabel !== "Edit";
  return (
    <div className="flex min-h-15 items-center justify-between gap-4 border-b border-slate-200 px-4 py-3.5 last:border-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {Icon && <Icon className="size-7 shrink-0 text-slate-400" strokeWidth={1.75} />}
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-600">{label}</p>
            {verified && (
              <LaBadge intent="success" size="md" className="gap-1 bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-3" />
                Verified
              </LaBadge>
            )}
          </div>
          <p className="truncate text-base font-medium text-slate-900">{value}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {onEdit && (
          <LaButton
            type="button"
            intent="ghost"
            size="compact"
            onClick={onEdit}
            className={cn(
              "gap-1 px-2 text-sm font-semibold",
              isLocked
                ? "text-slate-400 hover:bg-transparent hover:text-slate-500"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            )}
          >
            {isLocked && <Lock className="size-3.5" strokeWidth={2} aria-hidden="true" />}
            {editLabel}
          </LaButton>
        )}
        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${label}`}
            onClick={onRemove}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}

export function SettingsRow({
  label,
  subtitle,
  badge,
  onClick,
}: {
  label: string;
  subtitle?: string;
  badge?: "coming-soon";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={badge === "coming-soon"}
      className="group flex min-h-13 w-full items-center justify-between border-b border-slate-200 px-4 py-3.5 text-left last:border-0 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex flex-col">
        <span className="text-base font-medium text-slate-800 transition-colors group-hover:text-slate-900">
          {label}
        </span>
        {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        {badge === "coming-soon" && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-500">
            Soon
          </span>
        )}
        {!badge && <ChevronRight className="size-4 text-slate-400" />}
      </div>
    </button>
  );
}
