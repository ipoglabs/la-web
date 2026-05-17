"use client";

import * as React from "react";
import { COUNTRIES, Country } from "./countries";
import CountryPicker from "./CountryPicker";
import { cn } from "@/lib/utils";

export type PhoneNumberInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (digits: string) => void;
  country?: Country;
  defaultCountry?: Country | string;
  onCountryChange?: (c: Country) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** forwarded ref alternative for the input element */
  inputRef?: React.Ref<HTMLInputElement>;
  /** id for the inner input — useful for label association */
  id?: string;
  /** visible label text for the input */
  label?: string;
  /** class applied specifically to the input element */
  inputClassName?: string;
  maxLength?: number;
  showFlag?: boolean;
  countries?: Country[]; // override full list
  onlyCountries?: string[]; // list of ISO2 codes to limit
  /** id of an element that describes the input (error/help) */
  inputDescribedBy?: string;
};

export const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      country,
      defaultCountry,
      onCountryChange,
      placeholder = "1234512345",
      disabled,
      className,
      inputRef,
      id,
      label,
      inputClassName,
      maxLength,
      showFlag = true,
      countries,
      onlyCountries,
      inputDescribedBy,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internal, setInternal] = React.useState(defaultValue || "");
    const controlled = typeof value !== "undefined";

    const initialCountry = React.useMemo(() => {
      if (country) return country;
      if (typeof defaultCountry === "string") {
        return COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0];
      }
      if (typeof defaultCountry === "object" && defaultCountry) {
        return defaultCountry as Country;
      }
      return COUNTRIES[0];
    }, [country, defaultCountry]);

    const [selected, setSelected] = React.useState<Country>(initialCountry as Country || COUNTRIES[0]);

    // derive list
    const providedList = countries && countries.length ? countries : COUNTRIES;
    const visibleList = onlyCountries && onlyCountries.length
      ? providedList.filter((c: Country) => onlyCountries.includes(c.code))
      : providedList;

    const isSingleCountry = visibleList.length === 1;

    React.useEffect(() => {
      if (country) setSelected(country);
    }, [country]);

    function sanitize(val: string) {
      return val.replace(/[^0-9]/g, "");
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
      const digits = sanitize(e.target.value).slice(0, maxLength || 24);
      if (!controlled) setInternal(digits);
      onChange?.(digits);
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
      const txt = e.clipboardData.getData("text/plain");
      const digits = sanitize(txt).slice(0, maxLength || 24);
      e.preventDefault();
      if (!controlled) setInternal(digits);
      onChange?.(digits);
    }

    function handleSelectCountry(c: Country) {
      setSelected(c);
      onCountryChange?.(c);
    }

    const displayValue = controlled ? value! : internal;

    const FlagComp = (selected && selected.Flag) || COUNTRIES[0].Flag;

    // merge refs for the input element (forwarded ref + inputRef prop)
    const inputInternalRef = React.useRef<HTMLInputElement | null>(null);
    function assignRef<T>(r: React.Ref<T> | undefined, value: T | null) {
      if (!r) return;
      if (typeof r === "function") {
        try { r(value); } catch {}
      } else {
        try { (r as React.MutableRefObject<T | null>).current = value; } catch {}
      }
    }

    React.useEffect(() => {
      assignRef(ref, inputInternalRef.current);
      assignRef(inputRef, inputInternalRef.current);
    }, [ref, inputRef]);

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="button"
              onClick={isSingleCountry ? undefined : () => setOpen(true)}
              aria-haspopup="dialog"
              aria-label={isSingleCountry ? `${selected.name} +${selected.dial}` : "Open country selector"}
              className={cn(
                "inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-200 text-slate-800 text-sm",
                isSingleCountry ? "cursor-default" : "hover:bg-slate-300"
              )}
            >
              {showFlag && <FlagComp className="h-4 w-6" />}
              <span className="font-medium">+{selected.dial}</span>
            </button>
          </div>

          {label ? (
            <label htmlFor={id} className="sr-only">
              {label}
            </label>
          ) : null}

          <input
            id={id}
            ref={inputInternalRef}
            value={displayValue}
            onChange={handleInput}
            onPaste={handlePaste}
            placeholder={placeholder}
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={disabled}
            aria-describedby={inputDescribedBy}
            className={cn(
              [
                "flex h-10 w-full rounded-sm border-[1.5px] border-gray-700/50 bg-gray-50 pr-3 pl-24 py-2 text-base font-normal text-gray-900 caret-gray-900 placeholder:text-gray-400",
                "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                inputClassName,
              ]
                .filter(Boolean)
                .join(" ")
            )}
            aria-label={placeholder}
          />
        </div>

        <CountryPicker
          open={open}
          onClose={() => setOpen(false)}
          selected={selected}
          onSelect={handleSelectCountry}
          countries={visibleList}
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
