/**
 * LaSelect — la design system select
 * Native <select> with the same look-and-feel as LaInput.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaSelect } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC
 * ─────────────────────────────────────────────────────────────
 *   <LaSelect>
 *     <option value="">Pick one…</option>
 *     <option value="a">Option A</option>
 *   </LaSelect>
 *
 * ─────────────────────────────────────────────────────────────
 * STATUS
 * ─────────────────────────────────────────────────────────────
 *   <LaSelect status="error">…</LaSelect>
 *   <LaSelect status="success">…</LaSelect>
 *
 * ─────────────────────────────────────────────────────────────
 * PLACEHOLDER OPTION
 * ─────────────────────────────────────────────────────────────
 *   Always add a disabled empty-value first option:
 *   <option value="" disabled>Pick one…</option>
 *
 * ─────────────────────────────────────────────────────────────
 * OPTION GROUPS
 * ─────────────────────────────────────────────────────────────
 *   <LaSelect>
 *     <optgroup label="Asia">
 *       <option value="sg">Singapore</option>
 *     </optgroup>
 *   </LaSelect>
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   status?  "default"|"error"|"success"   Visual state. Auto-sets aria-invalid on "error".
 *   + all native <select> props (value, defaultValue, onChange, disabled, multiple, size, …)
 */
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LaSelectStatus = "default" | "error" | "success";

export interface LaSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  status?: LaSelectStatus;
}

const statusStyles: Record<LaSelectStatus, string> = {
  default: "",
  error:   "border-red-500 focus-visible:ring-red-500/25 focus-visible:bg-red-50",
  success: "border-green-600 focus-visible:ring-green-600/25 focus-visible:bg-green-50",
};

const baseSelectClasses = [
  "flex h-10 w-full appearance-none rounded-md border-[1.5px] border-gray-700/55 bg-gray-50 pl-3 py-2 pr-9 text-base font-normal text-gray-900",
  "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:ring-offset-1",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const LaSelect = React.forwardRef<HTMLSelectElement, LaSelectProps>(
  ({ status = "default", className, children,
     title, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby,
     ...props }, ref) => {

    const combinedClass = React.useMemo(
      () => cn(baseSelectClasses, statusStyles[status], className),
      [status, className]
    );

    return (
      <div className="relative flex items-center">
        <select
          ref={ref}
          className={combinedClass}
          title={title}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          {...props}
          {...(status === "error" && props["aria-invalid"] === undefined ? { "aria-invalid": true as const } : {})}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 size-4 shrink-0 text-slate-500"
        />
      </div>
    );
  }
);

LaSelect.displayName = "LaSelect";

export { LaSelect };
