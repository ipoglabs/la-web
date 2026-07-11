"use client";

import { Ban, type LucideIcon, Lock, Search, ShieldAlert, Wrench } from "lucide-react";
import { LaButton, LaText } from "@/components/la";

type ErrorPageAction = {
  label: string;
  onClick: () => void;
  intent?: "primary-blue" | "outline";
};

type ErrorPageShellProps = {
  code: string;
  title: string;
  description: string;
  eyebrow?: string;
  toneIcon?: "lock" | "ban" | "search" | "shield-alert" | "wrench";
  primaryAction: ErrorPageAction;
  secondaryAction?: ErrorPageAction;
  supportPrefix: string;
  supportEmail: string;
};

const toneIconMap: Record<NonNullable<ErrorPageShellProps["toneIcon"]>, LucideIcon> = {
  lock: Lock,
  ban: Ban,
  search: Search,
  "shield-alert": ShieldAlert,
  wrench: Wrench,
};

export default function ErrorPageShell({
  code,
  title,
  description,
  eyebrow,
  toneIcon,
  primaryAction,
  secondaryAction,
  supportPrefix,
  supportEmail,
}: ErrorPageShellProps) {
  const ToneIcon = toneIcon ? toneIconMap[toneIcon] : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-10 sm:py-16">
      <div className="w-full max-w-md space-y-5 text-center">
        <div className="space-y-2.5">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow ?? `Error ${code}`}
          </p>

          {ToneIcon ? (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
              <ToneIcon className="size-5" />
            </div>
          ) : null}

          <LaText type="h1" className="text-6xl font-extrabold leading-none tracking-tight text-slate-400 sm:text-7xl md:text-8xl">
            {code}
          </LaText>
        </div>

        <div className="space-y-2">
          <LaText type="h2" className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </LaText>
          <LaText type="small" className="text-sm text-muted-foreground">
            {description}
          </LaText>
        </div>

        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
          <LaButton
            intent={primaryAction.intent ?? "primary-blue"}
            size="default"
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </LaButton>

          {secondaryAction ? (
            <LaButton
              intent={secondaryAction.intent ?? "outline"}
              size="default"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </LaButton>
          ) : null}
        </div>
      </div>

      <p className="mt-16 text-center text-xs text-muted-foreground">
        {supportPrefix}{" "}
        <a
          href={`mailto:${supportEmail}`}
          className="underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Contact support
        </a>
      </p>
    </main>
  );
}
