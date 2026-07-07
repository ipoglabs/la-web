/**
 * LaAmount — currency-aware amount input
 * Solid amount field with optional currency pill, numeric sanitisation,
 * formatted display on blur, raw numeric editing on focus, and quick-pick values.
 */
"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { LaButton } from "./la-button";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { LaListSelect, type LaListSelectOption } from "./la-list-select";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

export type LaAmountStatus = "default" | "error" | "success";
export type LaAmountCurrency = "SGD" | "INR" | "GBP";

export interface LaAmountOption {
  value: number;
  label?: string;
}

export interface LaAmountProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type" | "prefix"> {
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  currency?: LaAmountCurrency;
  showCurrency?: boolean;
  status?: LaAmountStatus;
  options?: LaAmountOption[];
  errorMessage?: string;
  dropdownLabel?: string;
}

const statusStyles: Record<LaAmountStatus, string> = {
  default: "border-gray-700/55 focus-within:ring-blue-500/25 focus-within:bg-yellow-50",
  error: "border-red-500 bg-red-50/70 focus-within:ring-red-500/25 focus-within:bg-red-50",
  success: "border-green-600 focus-within:ring-green-600/25 focus-within:bg-green-50",
};

const currencyPillStyles: Record<LaAmountStatus, string> = {
  default: "bg-slate-200 text-slate-900",
  error: "bg-red-600 text-white",
  success: "bg-green-600 text-white",
};

const currencySymbolMap: Record<LaAmountCurrency, string> = {
  SGD: "S$",
  INR: "INR",
  GBP: "GBP",
};

function sanitizePositiveNumber(value: string) {
  const digitsAndDot = value.replace(/[^\d.]/g, "");
  const [integerPart, ...decimalParts] = digitsAndDot.split(".");
  if (decimalParts.length === 0) return integerPart;
  return `${integerPart}.${decimalParts.join("")}`;
}

function formatAmount(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("en-SG", {
    maximumFractionDigits: 2,
  }).format(value);
}

function parseAmount(raw: string): number | null {
  if (!raw.trim()) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function optionLabel(option: LaAmountOption) {
  return option.label ?? formatAmount(option.value);
}

export function LaAmount({
  value,
  defaultValue,
  onValueChange,
  currency = "SGD",
  showCurrency = true,
  status = "default",
  options = [],
  errorMessage,
  dropdownLabel = "Suggested amounts",
  className,
  disabled,
  placeholder = "0",
  id,
  name,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  onFocus,
  onBlur,
  ...props
}: LaAmountProps) {
  const desktopDropdownRef = React.useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number | null>(defaultValue ?? null);
  const resolvedValue = isControlled ? value ?? null : internalValue;
  const [draft, setDraft] = React.useState(() => formatAmount(resolvedValue));
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setDraft(formatAmount(resolvedValue));
    }
  }, [resolvedValue, isFocused]);

  React.useEffect(() => {
    setIsOptionsOpen(false);
  }, [isDesktop]);

  React.useEffect(() => {
    if (!isDesktop || !isOptionsOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!desktopDropdownRef.current) return;
      if (!desktopDropdownRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOptionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOptionsOpen]);

  const commitValue = React.useCallback((next: number | null) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  }, [isControlled, onValueChange]);

  const amountChoices = React.useMemo<LaListSelectOption[]>(() => {
    return options.map((item) => ({
      value: String(item.value),
      label: optionLabel(item),
    }));
  }, [options]);

  const applyPickedValue = React.useCallback((nextValue: number) => {
    commitValue(nextValue);
    setDraft(formatAmount(nextValue));
    setIsOptionsOpen(false);
  }, [commitValue]);

  const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextRaw = sanitizePositiveNumber(event.target.value);
    setDraft(nextRaw);
    commitValue(parseAmount(nextRaw));
  }, [commitValue]);

  const handleFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDraft(resolvedValue == null ? "" : String(resolvedValue));
    onFocus?.(event);
  }, [onFocus, resolvedValue]);

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const parsed = parseAmount(sanitizePositiveNumber(draft));
    commitValue(parsed);
    setDraft(formatAmount(parsed));
    onBlur?.(event);
  }, [commitValue, draft, onBlur]);

  const describedBy = cn(ariaDescribedby, errorMessage ? `${id ?? name ?? "amount"}-error` : undefined);
  const selectedOptionValue = resolvedValue == null ? "" : String(resolvedValue);

  return (
    <div ref={desktopDropdownRef} className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex h-10 w-full items-center rounded-md border-[1.5px] bg-gray-50 px-3 transition-colors focus-within:ring-2 focus-within:ring-offset-1",
          statusStyles[status],
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {showCurrency && (
          <div
            className={cn(
              "mr-3 inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-base font-normal transition-colors",
              currencyPillStyles[status],
            )}
          >
            <span>{currencySymbolMap[currency]}</span>
          </div>
        )}

        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={describedBy || undefined}
          data-invalid={status === "error" ? "true" : undefined}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-base font-normal text-gray-950 outline-none placeholder:text-slate-400",
            status === "error" && "text-red-600 placeholder:text-red-300",
          )}
          {...props}
        />

        {amountChoices.length > 0 && (
          <>
            {isDesktop ? (
              <div className="ml-2 shrink-0">
                <LaButton
                  type="button"
                  intent="ghost"
                  size="compact"
                  iconOnly
                  disabled={disabled}
                  aria-label="Choose suggested amount"
                  onClick={() => setIsOptionsOpen((prev) => !prev)}
                  className={cn(
                    "shrink-0 text-slate-900 hover:bg-transparent",
                    status === "error" && "text-red-600 hover:text-red-600",
                  )}
                >
                  <ChevronDown className={cn("size-4 transition-transform", isOptionsOpen && "rotate-180")} />
                </LaButton>

                {isOptionsOpen && (
                  <div className="absolute left-0 top-[calc(100%+0.375rem)] z-30 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <LaListSelect
                      value={selectedOptionValue}
                      onValueChange={(next) => applyPickedValue(Number(next))}
                      options={amountChoices}
                      className="max-h-64 overflow-y-auto p-2"
                    />
                  </div>
                )}
              </div>
            ) : (
              <LaButton
                type="button"
                intent="ghost"
                size="compact"
                iconOnly
                disabled={disabled}
                aria-label="Choose suggested amount"
                onClick={() => setIsOptionsOpen(true)}
                className={cn(
                  "ml-2 shrink-0 text-slate-900 hover:bg-transparent",
                  status === "error" && "text-red-600 hover:text-red-600",
                )}
              >
                <ChevronDown className="size-4" />
              </LaButton>
            )}
          </>
        )}
      </div>

      {errorMessage && (
        <p
          id={`${id ?? name ?? "amount"}-error`}
          className="mt-2 text-sm font-normal text-red-600"
        >
          {errorMessage}
        </p>
      )}

      {!isDesktop && amountChoices.length > 0 && (
        <ResponsivePicker
          open={isOptionsOpen}
          onOpenChange={setIsOptionsOpen}
          title={dropdownLabel}
        >
          <LaListSelect
            value={selectedOptionValue}
            onValueChange={(next) => applyPickedValue(Number(next))}
            options={amountChoices}
            className="gap-1"
          />
        </ResponsivePicker>
      )}
    </div>
  );
}

LaAmount.displayName = "LaAmount";

function ResponsivePicker({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="md:hidden">
      <Drawer open={open} onOpenChange={onOpenChange} noBodyStyles shouldScaleBackground={false}>
        <DrawerContent className="max-h-[80svh] border-slate-200 pt-0 [&>div:first-child]:hidden">
          <div className="rounded-t-2xl border-b border-slate-200 bg-linear-to-b from-slate-100 to-slate-50 px-4 pt-1.5 pb-1.5">
            <div className="mx-auto mb-1.5 h-0.5 w-6 rounded-full bg-slate-400" />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold tracking-wide text-slate-800">
                {title}
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-full bg-slate-200 transition-colors hover:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <X aria-hidden="true" className="size-4 text-slate-600" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-5 pt-1">{children}</div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export { formatAmount };