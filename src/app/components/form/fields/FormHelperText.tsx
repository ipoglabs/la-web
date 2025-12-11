// src/app/components/form/fields/FormHelperText.tsx
import React from "react";

export function FormHelperText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        "text-xs text-muted-foreground leading-relaxed",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
