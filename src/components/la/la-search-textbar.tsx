/**
 * LaSearchTextbar — type-to-search text box (a search bar instead of a dropdown)
 * Built on top of `LaInput`.
 *
 * Type a couple of letters and matching options appear under the box, like
 * the location search: options that START with the letters come first, then
 * options with a later word starting with them ("ro" → "Rolex", then
 * "Land Rover"). Pick one with a click, or ↑ / ↓ and Enter; Esc closes.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaSearchTextbar } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC — plain string options
 * ─────────────────────────────────────────────────────────────
 *   const [make, setMake] = useState("");
 *   <LaSearchTextbar
 *     options={["Audi", "BMW", "Honda", "Hyundai"]}
 *     value={make}
 *     onChange={setMake}
 *     placeholder="Search make"
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * LABEL / VALUE OPTIONS — stored value differs from what's shown
 * ─────────────────────────────────────────────────────────────
 *   <LaSearchTextbar
 *     options={[{ value: "gsd", label: "German Shepherd", sublabel: "Large" }]}
 *     value={breed}
 *     onChange={(value, option) => setBreed(value)}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   options        (string | LaSearchTextbarOption)[]  What can be picked.
 *   value?         string                 Selected option's value ("" = none).
 *   onChange?      (value, option?) => void  Called on pick, and with "" when cleared.
 *   minChars?      number                 Letters typed before options show. Default: 2.
 *   maxResults?    number                 Most options shown at once. Default: 8.
 *   emptyText?     string                 Shown when nothing matches. Default: "No matches found".
 *   status?        "default"|"error"|"success"  Passed to LaInput.
 *   placeholder?, disabled?, id?, name?, aria-label?, aria-describedby?, className?
 */
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { LaInput, type LaInputStatus } from "./la-input";
import { cn } from "@/lib/utils";

export type LaSearchTextbarOption = { value: string; label: string; sublabel?: string };

export interface LaSearchTextbarProps {
  options: (string | LaSearchTextbarOption)[];
  value?: string;
  onChange?: (value: string, option?: LaSearchTextbarOption) => void;
  minChars?: number;
  maxResults?: number;
  emptyText?: string;
  status?: LaInputStatus;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

type Match = { option: LaSearchTextbarOption; start: number };

const toOption = (o: string | LaSearchTextbarOption): LaSearchTextbarOption =>
  typeof o === "string" ? { value: o, label: o } : o;

/**
 * Options whose label starts with the query, then options with a later word
 * starting with it — each group in its original order. `start` is where the
 * matched letters begin in the label (for highlighting).
 */
function findMatches(options: LaSearchTextbarOption[], query: string, max: number): Match[] {
  const q = query.trim().toLowerCase();
  const first: Match[] = [];
  const later: Match[] = [];
  for (const option of options) {
    const label = option.label.toLowerCase();
    if (label.startsWith(q)) { first.push({ option, start: 0 }); continue; }
    const word = label.search(new RegExp(`[\\s\\-/(&,.]${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    if (word >= 0) later.push({ option, start: word + 1 });
  }
  return [...first, ...later].slice(0, max);
}

const LaSearchTextbar = React.forwardRef<HTMLInputElement, LaSearchTextbarProps>(
  (
    {
      options,
      value = "",
      onChange,
      minChars = 2,
      maxResults = 8,
      emptyText = "No matches found",
      status,
      placeholder,
      disabled,
      id,
      name,
      className,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    const all = React.useMemo(() => options.map(toOption), [options]);
    const selected = all.find((o) => o.value === value);

    // What's in the box: the selected option's label until the user types.
    const [text, setText] = React.useState(selected?.label ?? "");
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(0);
    // Follow `value` set from outside — but not the "" we send ourselves when
    // typing unpicks an option, which would wipe what's being typed.
    const unpickedByTyping = React.useRef(false);
    React.useEffect(() => {
      if (unpickedByTyping.current) { unpickedByTyping.current = false; return; }
      setText(selected?.label ?? "");
    }, [value, selected?.label]);

    const autoId = React.useId();
    const listId = `${id ?? autoId}-list`;
    const optionId = (i: number) => `${listId}-${i}`;

    const typedEnough = text.trim().length >= minChars;
    const matches = React.useMemo(
      () => (typedEnough ? findMatches(all, text, maxResults) : []),
      [all, text, typedEnough, maxResults]
    );
    const showList = open && typedEnough && !disabled;

    const pick = (option: LaSearchTextbarOption) => {
      setText(option.label);
      setOpen(false);
      onChange?.(option.value, option);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      setActive(0);
      setOpen(true);
      // Editing away from the picked label unpicks it.
      if (value && e.target.value !== selected?.label) {
        unpickedByTyping.current = e.target.value !== "";
        onChange?.("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (!showList || matches.length === 0) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % matches.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + matches.length) % matches.length); }
      else if (e.key === "Enter") { e.preventDefault(); pick(matches[active].option); }
    };

    // Leaving the box with half-typed text puts the picked label back.
    const handleBlur = () => {
      setOpen(false);
      setText(selected?.label ?? text);
    };

    return (
      <div className={cn("relative w-full", className)}>
        <LaInput
          ref={ref}
          id={id}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && matches.length ? optionId(active) : undefined}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          prefix={<Search className="size-4" />}
          clearable
          onClear={() => setOpen(false)}
          status={status}
          placeholder={placeholder}
          disabled={disabled}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
        />

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-slate-300 bg-white py-1 shadow-lg"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-500">{emptyText}</li>
            ) : (
              matches.map(({ option, start }, i) => {
                const end = start + text.trim().length;
                return (
                  <li
                    key={option.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === active}
                    // mousedown, not click: fires before the input's blur closes the list
                    onMouseDown={(e) => { e.preventDefault(); pick(option); }}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex cursor-pointer flex-col px-3 py-2 text-base text-slate-700",
                      i === active && "bg-blue-50 text-slate-900"
                    )}
                  >
                    <span>
                      {option.label.slice(0, start)}
                      <strong className="font-semibold text-slate-900">{option.label.slice(start, end)}</strong>
                      {option.label.slice(end)}
                    </span>
                    {option.sublabel && <span className="text-sm text-slate-500">{option.sublabel}</span>}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    );
  }
);
LaSearchTextbar.displayName = "LaSearchTextbar";

export { LaSearchTextbar };
