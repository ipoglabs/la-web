/**
 * LaMinMax — composite min / max amount input pair
 */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LaAmount, type LaAmountCurrency, type LaAmountOption } from "./la-amount";

export interface LaMinMaxValue {
  min: number | null;
  max: number | null;
}

export interface LaMinMaxProps {
  value: LaMinMaxValue;
  onValueChange: (value: LaMinMaxValue) => void;
  currency?: LaAmountCurrency;
  showCurrency?: boolean;
  minLabel?: string;
  maxLabel?: string;
  options?: LaAmountOption[];
  minOptions?: LaAmountOption[];
  maxOptions?: LaAmountOption[];
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function LaMinMax({
  value,
  onValueChange,
  currency = "SGD",
  showCurrency = true,
  minLabel = "Minimum",
  maxLabel = "Maximum",
  options = [],
  minOptions,
  maxOptions,
  errorMessage,
  className,
  disabled,
}: LaMinMaxProps) {
  const validationError = errorMessage ?? getMinMaxError(value);

  return (
    <section className={cn("rounded-xl bg-white px-4 py-5", className)}>
      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2 md:gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">{minLabel}</p>
            <LaAmount
              value={value.min}
              onValueChange={(min) => onValueChange({ ...value, min })}
              currency={currency}
              showCurrency={showCurrency}
              status={validationError ? "error" : "default"}
              options={minOptions ?? options}
              disabled={disabled}
              aria-label={minLabel}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">{maxLabel}</p>
            <LaAmount
              value={value.max}
              onValueChange={(max) => onValueChange({ ...value, max })}
              currency={currency}
              showCurrency={showCurrency}
              status={validationError ? "error" : "default"}
              options={maxOptions ?? options}
              disabled={disabled}
              aria-label={maxLabel}
            />
          </div>
        </div>

        {validationError && (
          <p className="text-sm font-normal text-red-600">
            {validationError}
          </p>
        )}
      </div>
    </section>
  );
}

LaMinMax.displayName = "LaMinMax";

function getMinMaxError(value: LaMinMaxValue) {
  if (value.min == null || value.max == null) return "";
  if (value.min > value.max) return "Min. value cannot be more than Max. value";
  return "";
}