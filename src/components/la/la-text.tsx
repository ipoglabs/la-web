/**
 * LaText — la design system typography primitive
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaText } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * TYPES
 * ─────────────────────────────────────────────────────────────
 *   Headings (font-display, Inter Display):
 *     "h1"    — text-4xl  font-semibold  tracking-tight  text-slate-700
 *     "h2"    — text-3xl  font-normal    tracking-tight  text-slate-800
 *     "h3"    — text-2xl  font-light                     text-slate-900
 *     "h4"    — text-xl   font-light                     text-slate-900
 *     "h5"    — text-lg   font-light                     text-slate-900
 *
 *   Body copy:
 *     "body"  — text-base font-normal  leading-relaxed   text-slate-900  [default]
 *     "small" — text-sm   font-normal  leading-normal    text-slate-500
 *     "muted" — text-sm   font-normal  leading-normal    text-slate-400
 *
 *   UI:
 *     "label" — text-sm  font-medium                     text-slate-700
 *
 *   Special:
 *     "quote" — text-base italic border-l-4 border-slate-300 pl-4  text-slate-600
 *     "code"  — text-sm  font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS
 * ─────────────────────────────────────────────────────────────
 *   type?     TextType          Visual style. Default: "body".
 *   as?       React.ElementType Override rendered HTML tag while keeping the style.
 *   truncate? boolean           Single-line clamp with ellipsis. Default: false.
 *   className?                  Merged via cn() — safe to override any style.
 *   + all standard HTML element props
 *
 * ─────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────
 *   <LaText type="h1">Page Title</LaText>
 *   <LaText type="body">Paragraph text.</LaText>
 *   <LaText type="label" as="label" htmlFor="email">Email</LaText>
 *   <LaText type="h2" as="h3">Looks h2, renders h3 (SEO control)</LaText>
 *   <LaText type="body" truncate className="max-w-xs">Long text…</LaText>
 *   <LaText type="muted" className="text-xs">Override size</LaText>
 */
import * as React from "react";
import { cn } from "@/lib/utils";

type TextType =
  | "h1" | "h2" | "h3" | "h4" | "h5"
  | "body" | "small" | "muted" | "label"
  | "quote" | "code";

// Default HTML tag per type
const defaultTag: Record<TextType, React.ElementType> = {
  h1:    "h1",
  h2:    "h2",
  h3:    "h3",
  h4:    "h4",
  h5:    "h5",
  body:  "p",
  small: "p",
  muted: "p",
  label: "span",
  quote: "blockquote",
  code:  "code",
};

// Base styles per type — override any of these via className
const typeStyles: Record<TextType, string> = {
  h1:    "font-display text-4xl font-semibold tracking-tight text-slate-700",
  h2:    "font-display text-3xl font-normal tracking-tight text-slate-800",
  h3:    "font-display text-2xl font-light text-slate-900",
  h4:    "font-display text-xl font-light text-slate-900",
  h5:    "font-display text-lg font-light text-slate-900",

  body:  "text-base font-normal text-slate-900 leading-relaxed",
  small: "text-sm font-normal text-slate-500 leading-normal",
  muted: "text-sm font-normal text-slate-400 leading-normal",
  label: "text-sm font-medium text-slate-700",
  quote: "text-base italic text-slate-600 border-l-4 border-slate-300 pl-4",
  code:  "text-sm font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded",
};

export interface LaTextProps extends React.HTMLAttributes<HTMLElement> {
  type?:     TextType;
  /** Override the rendered HTML tag while keeping the type's visual style */
  as?:       React.ElementType;
  truncate?: boolean;
  /** Forwarded to the underlying element — useful when as="label" */
  htmlFor?:  string;
}

const LaText = React.forwardRef<HTMLElement, LaTextProps>(
  ({ type = "body", as, truncate = false, className, children, ...props }, ref) => {
    const Tag = as ?? defaultTag[type];
    return (
      <Tag
        ref={ref}
        className={cn(
          typeStyles[type],
          truncate && "truncate",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
LaText.displayName = "LaText";

export { LaText };
