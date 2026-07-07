import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value: string;
  onValueChange: (value: string) => void;
}

export function ToggleGroup({
  type = "single",
  value,
  onValueChange,
  className,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <div role="group" className={cn("toggle-group", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          selected: child.props.value === value,
          onClick: () => onValueChange(child.props.value),
        });
      })}
    </div>
  );
}

export interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  selected?: boolean;
}

export function ToggleGroupItem({
  value,
  selected,
  className,
  ...props
}: ToggleGroupItemProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "toggle-group-item",
        selected
          ? "bg-primary text-white dark:bg-gray-900 dark:text-primary border-2 border-primary"
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
        className
      )}
      {...props}
    />
  );
}
