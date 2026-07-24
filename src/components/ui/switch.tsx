"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default" | "lg";
}

function Switch({
  className,
  size = "default",
  checked,
  onCheckedChange,
  onChange,
  disabled,
  ...props
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
    onChange?.(e);
  };

  return (
    <label
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors",
        size === "lg" ? "h-8 w-14" : size === "default" ? "h-5.5 w-10" : "h-4 w-7",
        checked ? "bg-green-700" : "bg-slate-200",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...props}
      />
      <span
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow transition-transform",
          size === "lg"
            ? cn("size-6", checked ? "translate-x-7" : "translate-x-1")
            : size === "default"
              ? cn("size-4", checked ? "translate-x-5" : "translate-x-0.75")
              : cn("size-3", checked ? "translate-x-3.5" : "translate-x-0.5"),
        )}
      />
    </label>
  );
}

export { Switch }
