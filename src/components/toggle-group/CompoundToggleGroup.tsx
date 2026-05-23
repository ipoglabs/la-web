"use client";
import { createContext, useContext, useState, useId, useCallback, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface ToggleGroupContextValue {
  selected: string[];
  toggle: (value: string) => void;
  disabledItems: string[];
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | undefined>(undefined);

interface ToggleButtonGroupProps {
  children: ReactNode;
  disabledItems?: string[];
  onChange?: (selected: string[]) => void;
  title?: string;
  isMandatory?: boolean;
  errorMessage?: string;
  showError?: boolean;
  singleSelect?: boolean;
  requireSelection?: boolean;
  /** Pre-select specific values on mount (uncontrolled) */
  defaultValue?: string[];
  /** Fully controlled — provide alongside onChange to own the state externally */
  value?: string[];
  /** Extra classes on the outer wrapper div */
  className?: string;
}

/**
 * ToggleButtonGroup
 * Compound toggle group — single or multi-select with optional validation.
 *
 * Modes:
 * - Uncontrolled (default): manages its own state, optionally seeded via `defaultValue`
 * - Controlled: pass `value` + `onChange` to own the state externally
 *
 * Use ToggleGroupButton as children.
 */
export function ToggleButtonGroup({
  children,
  disabledItems = [],
  onChange,
  title,
  isMandatory,
  errorMessage,
  showError = false,
  singleSelect = false,
  requireSelection = false,
  defaultValue = [],
  value,
  className,
}: ToggleButtonGroupProps) {
  const isControlled = value !== undefined;
  const titleId = useId();

  // Internal state used only in uncontrolled mode
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultValue);

  const selected = isControlled ? value : internalSelected;

  const toggle = useCallback((item: string) => {
    let next: string[];
    if (singleSelect) {
      next = selected.includes(item) ? (requireSelection ? selected : []) : [item];
    } else {
      if (selected.includes(item)) {
        next =
          requireSelection && selected.length === 1
            ? selected
            : selected.filter((v) => v !== item);
      } else {
        next = [...selected, item];
      }
    }
    if (!isControlled) setInternalSelected(next);
    onChange?.(next);
  }, [selected, singleSelect, requireSelection, isControlled, onChange]);

  return (
    <ToggleGroupContext.Provider value={{ selected, toggle, disabledItems }}>
      <div className={cn("w-full flex flex-col gap-2", className)}>
        {/* Title and error — only rendered when present */}
        {(title || (showError && errorMessage)) && (
          <div className="flex flex-col gap-1 mb-2">
            {title && (
              <p id={titleId} className="font-semibold text-sm text-stone-800">
                {title}
                {isMandatory && <span className="text-red-500 ml-1">*</span>}
              </p>
            )}
            {showError && errorMessage && (
              <div role="alert" className="text-xs text-red-500">{errorMessage}</div>
            )}
          </div>
        )}
        {/* Toggle buttons — role="group" groups them for assistive technology */}
        <div
          role="group"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : "toggle group"}
          className="flex flex-wrap gap-2"
        >
          {children}
        </div>
      </div>
    </ToggleGroupContext.Provider>
  );
}

// Props for each button item
interface ToggleGroupButtonProps {
  value: string;
  children: ReactNode;
  icon?: ElementType;
  disabled?: boolean;
  /** Visual size of the pill button */
  size?: "mini" | "compact" | "default" | "lg";
}

/**
 * ToggleGroupButton
 * A single toggle button within the group.
 * Uses context to get selection state and toggle logic.
 */
export function ToggleGroupButton({
  value,
  children,
  icon: Icon,
  disabled,
  size = "default",
}: ToggleGroupButtonProps) {
  // Get selection state and toggle function from context
  const ctx = useContext(ToggleGroupContext);
  if (!ctx)
    throw new Error("ToggleGroupButton must be used within ToggleButtonGroup");

  const isSelected = ctx.selected.includes(value);
  const isDisabled = disabled || ctx.disabledItems.includes(value);

  return (
    <button
      type="button"
      disabled={isDisabled}
      data-pressed={isSelected}
      onClick={() => ctx.toggle(value)}
      className={cn(
        "relative rounded-full border font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-800",
        "focus:outline-none",
        size === "mini"    ? "px-2 py-px text-[10px]"  :
        size === "compact" ? "px-2.5 py-0.5 text-xs"   :
        size === "lg"      ? "px-5 py-2 text-base"      :
                             "px-4 py-1 text-sm",
        isSelected
          ? "bg-stone-800 text-stone-100 border-stone-800 shadow-sm"
          : "bg-white text-stone-900 border-stone-400",
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : isSelected
            ? "cursor-pointer hover:bg-stone-700 hover:border-stone-700"
            : "cursor-pointer hover:bg-stone-100 hover:border-stone-300"
      )}
    >
      <span className="flex items-center gap-1">
        {children}
        {Icon && (
          <Icon className={cn(
            size === "mini" || size === "compact" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4",
            isSelected ? "text-stone-100" : "text-stone-500"
          )} />
        )}
      </span>
    </button>
  );
}
