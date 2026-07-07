import * as React from "react";
import { LaText } from "./la-text";

export default function LaTokenRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
      <LaText type="label" as="span" className="w-28 shrink-0 text-xs text-slate-500">
        {label}
      </LaText>
      {children}
    </div>
  );
}
