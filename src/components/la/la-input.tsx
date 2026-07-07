/**
 * LaInput — la design system text input
 * Built on top of `components/ui/input`.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaInput } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC
 * ─────────────────────────────────────────────────────────────
 *   <LaInput placeholder="Enter your name" />
 *   <LaInput disabled placeholder="Not editable" />
 *
 * ─────────────────────────────────────────────────────────────
 * STATUS — visual feedback + aria-invalid wired automatically
 * ─────────────────────────────────────────────────────────────
 *   <LaInput status="error"   placeholder="Invalid email" />
 *   <LaInput status="success" placeholder="Looks good!" />
 *
 * ─────────────────────────────────────────────────────────────
 * PREFIX / SUFFIX — decorative slots inside the input edges
 * ─────────────────────────────────────────────────────────────
 *   import { Search } from "lucide-react";
 *
 *   <LaInput prefix={<Search className="size-4" />} placeholder="Search..." />
 *   <LaInput prefix="$" placeholder="0.00" />
 *   <LaInput suffix="kg" placeholder="Weight" />
 *   // Accessible label for screen readers:
 *   <LaInput prefix={<Globe className="size-4" />} prefixLabel="Website URL" />
 *
 * ─────────────────────────────────────────────────────────────
 * CLEARABLE — × button appears when the input has a value
 * ─────────────────────────────────────────────────────────────
 *   // Uncontrolled — works out of the box
 *   <LaInput clearable placeholder="Type something..." />
 *
 *   // Controlled — onChange handles the clear too (value becomes "")
 *   const [q, setQ] = useState("");
 *   <LaInput
 *     clearable
 *     value={q}
 *     onChange={(e) => setQ(e.target.value)}
 *   />
 *
 *   // Optional onClear callback (analytics, side-effects, focus management)
 *   <LaInput clearable onClear={() => console.log("cleared")} placeholder="Search" />
 *
 * ─────────────────────────────────────────────────────────────
 * PASSWORD TOGGLE — eye / eye-off button (type="password" only)
 * ─────────────────────────────────────────────────────────────
 *   <LaInput type="password" showPasswordToggle placeholder="Password" />
 *
 *   // Combined with clearable
 *   <LaInput type="password" showPasswordToggle clearable placeholder="Password" />
 *
 * ─────────────────────────────────────────────────────────────
 * FULLY COMBINED EXAMPLE
 * ─────────────────────────────────────────────────────────────
 *   <LaInput
 *     prefix={<Search className="size-4" />}
 *     suffix="kg"
 *     clearable
 *     status="error"
 *     placeholder="Search..."
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   status?             "default"|"error"|"success"   Visual state. Auto-sets aria-invalid on "error".
 *   prefix?             ReactNode                      Left decorative slot (icon / text).
 *   suffix?             ReactNode                      Right decorative slot (icon / text).
 *   prefixLabel?        string                         aria-label for the prefix slot.
 *   suffixLabel?        string                         aria-label for the suffix slot.
 *   clearable?          boolean                        Show × when value is non-empty. Default: false.
 *   onClear?            () => void                     Called after the value is cleared.
 *   showPasswordToggle? boolean                        Eye/EyeOff toggle. Only when type="password". Default: false.
 *   + all native <input> props (type, value, defaultValue, onChange, disabled, …)
 */
"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";
import { LaButton } from "./la-button";
import { Solid_X_24by24 } from "@/components/icons/la-icons";
import { cn } from "@/lib/utils";

export type LaInputStatus = "default" | "error" | "success";

export interface LaInputProps extends Omit<InputProps, "prefix"> {
  status?: LaInputStatus;
  /** Left-side decorative slot — icon or short text. */
  prefix?: React.ReactNode;
  /** Right-side decorative slot — icon or short text. */
  suffix?: React.ReactNode;
  /** aria-label for the prefix slot (for screen readers). */
  prefixLabel?: string;
  /** aria-label for the suffix slot (for screen readers). */
  suffixLabel?: string;
  /**
   * Show a clear (×) button when the input contains a value.
   * Works with both controlled (`value` prop) and uncontrolled inputs.
   * Default: `false`.
   */
  clearable?: boolean;
  /** Called after the value is cleared by the clear button. */
  onClear?: () => void;
  /**
   * Show a show/hide password toggle button.
   * Only active when `type="password"`.
   * Default: `false`.
   */
  showPasswordToggle?: boolean;
}

const statusStyles: Record<LaInputStatus, string> = {
  default: "",
  error:   "border-red-500 focus-visible:ring-red-500/25 focus-visible:bg-red-50",
  success: "border-green-600 focus-visible:ring-green-600/25 focus-visible:bg-green-50",
};

const baseInputClasses = [
  "flex h-10 w-full rounded-md border-[1.5px] border-gray-700/55 bg-gray-50 px-3 py-2 text-base font-normal text-gray-900 placeholder:text-gray-500",
  "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:ring-offset-1",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
].join(" ");

const LaInput = React.forwardRef<HTMLInputElement, LaInputProps>(
  (
    {
      status = "default",
      prefix,
      suffix,
      prefixLabel,
      suffixLabel,
      clearable = false,
      onClear,
      showPasswordToggle = false,
      className,
      type,
      onChange,
      ...props
    },
    ref
  ) => {
    // Use an internal ref so we can imperatively clear the DOM value
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!, []);

    // ── has-value tracking (drives clear button visibility) ──────────────
    // Controlled: derive directly from the value prop.
    // Uncontrolled: mirror via local state updated on every change.
    const isControlled = props.value !== undefined;
    const [uncontrolledHasValue, setUncontrolledHasValue] = React.useState(
      () => !!props.defaultValue
    );
    const hasValue = isControlled
      ? String(props.value ?? "").length > 0
      : uncontrolledHasValue;

    // ── password visibility toggle ────────────────────────────────────────
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordField = type === "password";
    const resolvedType = isPasswordField && showPassword ? "text" : type;

    // ── right-side slot count → padding & positions ────────────────────
    // Interactive buttons sit closest to the right edge; suffix is decorative,
    // always to the left of all buttons.
    //
    //  0 buttons: suffix → right-3
    //  1 button : suffix → right-10  (button occupies right-2..36px)
    //  2 buttons: suffix → right-[68px] (buttons occupy right-2..64px)
    const hasSuffix = !!suffix;
    const rightButtonCount =
      (clearable ? 1 : 0) + (showPasswordToggle && isPasswordField ? 1 : 0);
    const totalRight = (hasSuffix ? 1 : 0) + rightButtonCount;
    const rightPadClass =
      totalRight === 0 ? "" :
      totalRight === 1 ? "pr-9" :
      totalRight === 2 ? "pr-16" : "pr-24";
    const suffixRightClass =
      rightButtonCount === 0 ? "right-3" :
      rightButtonCount === 1 ? "right-10" :
      "right-[68px]";

    // ── combined input className ──────────────────────────────────────────
    const padLeft = !!prefix;
    const combinedClass = React.useMemo(
      () =>
        cn(
          baseInputClasses,
          padLeft && "pl-9",
          rightPadClass,
          statusStyles[status],
          className
        ),
      [padLeft, rightPadClass, status, className]
    );

    const ariaInvalid =
      props["aria-invalid"] ?? (status === "error" ? true : undefined);

    // ── intercept onChange to track uncontrolled value ────────────────────
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setUncontrolledHasValue(e.target.value.length > 0);
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    // ── clear handler ─────────────────────────────────────────────────────
    const handleClear = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;

      // Wipe the DOM value first so controlled reads target.value === ""
      el.value = "";
      el.focus();

      // Fire onChange so controlled parents can update their state
      if (onChange) {
        onChange({
          target: el,
          currentTarget: el,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }

      setUncontrolledHasValue(false);
      onClear?.();
    }, [onChange, onClear]);

    // When both clear and password toggle are shown, clear sits one slot left
    const clearRight =
      showPasswordToggle && isPasswordField ? "right-9" : "right-2";

    // ── no overlay slots → render bare input ─────────────────────────────
    const needsWrapper =
      padLeft ||
      hasSuffix ||
      clearable ||
      (showPasswordToggle && isPasswordField);

    if (!needsWrapper) {
      return (
        <Input
          ref={innerRef}
          type={resolvedType}
          className={combinedClass}
          onChange={handleChange}
          aria-invalid={ariaInvalid}
          {...props}
        />
      );
    }

    // ── wrapper with overlaid slots ───────────────────────────────────────
    return (
      <div className="relative flex items-center">
        {/* Left prefix (decorative) */}
        {prefix && (() => {
          const a11y = prefixLabel
            ? { role: "img" as const, "aria-label": prefixLabel }
            : { "aria-hidden": true as const };
          return (
            <span {...a11y} className="pointer-events-none absolute left-3 flex items-center text-slate-500">
              {prefix}
            </span>
          );
        })()}

        <Input
          ref={innerRef}
          type={resolvedType}
          className={combinedClass}
          onChange={handleChange}
          aria-invalid={ariaInvalid}
          {...props}
        />

        {/* Right suffix (decorative) — always left of all interactive buttons */}
        {suffix && (() => {
          const a11y = suffixLabel
            ? { role: "img" as const, "aria-label": suffixLabel }
            : { "aria-hidden": true as const };
          return (
            <span
              {...a11y}
              className={cn(
                "pointer-events-none absolute flex items-center text-slate-500",
                suffixRightClass
              )}
            >
              {suffix}
            </span>
          );
        })()}

        {/* Password show/hide toggle */}
        {showPasswordToggle && isPasswordField && (
          <LaButton
            type="button"
            intent="ghost"
            size="compact"
            iconOnly
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </LaButton>
        )}

        {/* Clear button — invisible when empty, hidden when input is disabled */}
        {clearable && (
          <LaButton
            type="button"
            intent="ghost"
            size="compact"
            iconOnly
            aria-label="Clear input"
            onClick={handleClear}
            disabled={props.disabled}
            tabIndex={hasValue && !props.disabled ? 0 : -1}
            className={cn(
              "absolute",
              clearRight,
              hasValue && !props.disabled ? "visible" : "invisible"
            )}
          >
            <Solid_X_24by24 className="size-4" />
          </LaButton>
        )}
      </div>
    );
  }
);
LaInput.displayName = "LaInput";

export { LaInput };
