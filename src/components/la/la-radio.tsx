/**
 * LaRadio — la design system radio
 * Native <input type="radio"> with custom look-and-feel.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaRadio } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC GROUP
 * ─────────────────────────────────────────────────────────────
 *   <LaRadio name="fruit" value="apple"  label="Apple"  />
 *   <LaRadio name="fruit" value="banana" label="Banana" />
 *
 * ─────────────────────────────────────────────────────────────
 * CONTROLLED
 * ─────────────────────────────────────────────────────────────
 *   const [val, setVal] = useState("apple");
 *
 *   <LaRadio
 *     name="fruit"
 *     value="apple"
 *     label="Apple"
 *     checked={val === "apple"}
 *     onChange={() => setVal("apple")}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * STATUS
 * ─────────────────────────────────────────────────────────────
 *   <LaRadio name="x" value="a" label="Option A" status="error" />
 *
 * ─────────────────────────────────────────────────────────────
 * DISABLED
 * ─────────────────────────────────────────────────────────────
 *   <LaRadio name="x" value="a" label="Unavailable" disabled />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   label?   ReactNode                   Text displayed next to the radio circle.
 *   status?  "default" | "error"         "error" turns the circle border/fill red.
 *   + all native <input type="radio"> props (name, value, checked, defaultChecked, onChange, disabled, …)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type LaRadioStatus = "default" | "error";

export interface LaRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Text label displayed to the right of the radio circle. */
  label?: React.ReactNode;
  /** Visual status — "error" turns the ring red. Default: "default". */
  status?: LaRadioStatus;
}

const LaRadio = React.forwardRef<HTMLInputElement, LaRadioProps>(
  ({ label, status = "default", className, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "inline-flex items-center gap-2.5",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
      >
        {/* Native radio — hidden, drives peer styles */}
        <input
          ref={ref}
          id={radioId}
          type="radio"
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />

        {/* Custom circle */}
        <span
          className={cn(
            // Base
            "flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white transition-colors",
            // Focus ring (keyboard navigation)
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/25 peer-focus-visible:ring-offset-2",
            // Status colours
            status === "error"
              ? "border-red-500 peer-checked:border-red-500 peer-checked:bg-red-500"
              : "border-gray-400 peer-checked:border-blue-600 peer-checked:bg-blue-600",
          )}
        >
          {/*
           * Inner white dot.
           * Always rendered white — invisible on white bg (unchecked),
           * visible on blue/red bg (checked). Pure CSS, no JS needed.
           */}
          <span className="size-2 rounded-full bg-white" />
        </span>

        {/* Label text */}
        {label && (
          <span className="select-none text-base font-normal leading-none text-gray-900">
            {label}
          </span>
        )}
      </label>
    );
  },
);

LaRadio.displayName = "LaRadio";

export { LaRadio };
