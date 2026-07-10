import { Label } from "@/components/ui/label";
import React from "react";
import { FormHelperText } from "./FormHelperText";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  helperLabel?: string;
  showFocusWithin?: boolean;
}

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className,
  helperLabel,
  showFocusWithin = true,
}: FormFieldProps) {
  const highlightClasses = showFocusWithin
    ? [
        "before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:bg-blue-600 before:rounded-tl before:rounded-bl before:scale-y-100 before:origin-left before:opacity-0 before:pointer-events-none before:-translate-x-3",
        "focus-within:before:opacity-100 focus-within:before:scale-y-100",
      ]
    : [];
  return (
    <div
      className={[
        "relative",
        ...highlightClasses,
        className ? className : "mb-4",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Label
        className="text-base font-normal text-slate-800 mb-1"
        htmlFor={htmlFor}
      >
        {label}
      </Label>
      {error && (
        <div className="text-xs italic font-normal text-red-600 -mt-2 mb-1">
          {error}
        </div>
      )}
      {children}

      {helperLabel && (
        <FormHelperText className="mt-1">{helperLabel}</FormHelperText>
      )}
    </div>
  );
}
