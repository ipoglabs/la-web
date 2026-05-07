"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Toast = { id: string; title: string; duration?: number };

const ToastContext = React.createContext<{
  push: (t: { title: string; duration?: number }) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = React.useCallback((t: { title: string; duration?: number }) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    const toast: Toast = { id, title: t.title, duration: t.duration ?? 4000 };
    setToasts((s) => [...s, toast]);
    // auto remove
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), toast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-md bg-white shadow-lg border border-slate-200 p-3",
              "text-sm text-slate-900"
            )}
            role="status"
            aria-live="polite"
          >
            {t.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
