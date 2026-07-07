/**
 * la design system — barrel export
 * Import everything from "@/components/la"
 */

// Button
export { LaButton }          from "./la-button";
export type { LaButtonProps } from "./la-button";

// Input
export { LaInput }           from "./la-input";
export type { LaInputProps, LaInputStatus } from "./la-input";
export { LaTagInput }        from "./la-tag-input";
export type { LaTagInputProps } from "./la-tag-input";

// Amount
export { LaAmount, formatAmount } from "./la-amount";
export type { LaAmountProps, LaAmountStatus, LaAmountCurrency, LaAmountOption } from "./la-amount";

// Min Max
export { LaMinMax } from "./la-minmax";
export type { LaMinMaxProps, LaMinMaxValue } from "./la-minmax";

// Field
export { LaField, LaFieldGroup } from "./la-field";
export type { LaFieldProps }      from "./la-field";

// Badge
export { LaBadge }           from "./la-badge";
export type { LaBadgeProps }  from "./la-badge";

// Card
export { LaCard } from "./la-card";
export type { LaCardProps } from "./la-card";

// Separator
export { LaSeparator }       from "./la-separator";
export type { LaSeparatorProps } from "./la-separator";

// Tabs
export { LaTabs, LaTabsList, LaTabsTrigger, LaTabsContent } from "./la-tabs";
export type { LaTabsTriggerProps } from "./la-tabs";

// Text
export { LaText }            from "./la-text";
export type { LaTextProps }   from "./la-text";

// Select
export { LaSelect }           from "./la-select";
export type { LaSelectProps, LaSelectStatus } from "./la-select";

// List Select (pick-one list primitive)
export { LaListSelect } from "./la-list-select";
export type { LaListSelectProps, LaListSelectOption, LaListSelectOptionGroup } from "./la-list-select";

// Responsive Select
export { LaSelectResponsive } from "./la-select-responsive";
export type { LaSelectResponsiveProps } from "./la-select-responsive";

// Radio
export { LaRadio }            from "./la-radio";
export type { LaRadioProps, LaRadioStatus } from "./la-radio";

// Section
export { default as LaSection } from "./la-section";
export { default as LaTokenRow } from "./la-token-row";

// Textarea
export { LaTextarea } from "./la-textarea";
export type { LaTextareaProps, LaTextareaStatus } from "./la-textarea";
