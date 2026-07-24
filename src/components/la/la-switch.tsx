/**
 * LaSwitch — la design system switch
 * Thin wrapper around the shadcn `Switch` primitive (components/ui/switch)
 * so pages/features never import ui/ directly (Import Rule).
 *
 * Adds an optional inline `label` + `description` for the common
 * "label left, switch right" settings-row pattern, so callers don't have
 * to hand-roll that layout every time.
 */
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface LaSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default" | "lg";
  label?: string;
  description?: string;
  className?: string;
}

export function LaSwitch({
  checked,
  onCheckedChange,
  size = "default",
  label,
  description,
  className,
  disabled,
  ...props
}: LaSwitchProps) {
  if (!label && !description) {
    return (
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        size={size}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }

  return (
    <label
      className={cn(
        "flex min-h-13 w-full cursor-pointer items-center justify-between gap-4 py-3.5",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span className="min-w-0">
        {label && <span className="block text-base font-medium text-slate-800">{label}</span>}
        {description && (
          <span className="mt-0.5 block text-sm text-slate-500">{description}</span>
        )}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        size={size}
        disabled={disabled}
        className="shrink-0"
        {...props}
      />
    </label>
  );
}
