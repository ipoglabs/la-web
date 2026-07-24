/**
 * create-alert — type definitions
 *
 * All alert config data lives in alert-config.ts.
 * The journey component and dialog/banner import from here.
 */

export type FilterOption = {
  readonly label: string;
  readonly value: string;
  /** lucide icon name — resolved via ICON_MAP in the journey component */
  readonly icon?: string;
};

/**
 * Extend this union as new input types are introduced (range, date, text).
 * All current filters use "toggle" but the type is open for future use.
 */
export type FilterType = "toggle" | "range" | "text" | "date";

export type FilterConfig = {
  readonly id: string;
  readonly label: string;
  readonly type: FilterType;
  readonly options: readonly FilterOption[];
  /** single-select (radio style). Default: false (multi-select) */
  readonly singleSelect?: boolean;
};

export type SubCategory = {
  readonly id: string;
  readonly label: string;
  /** Optional sub-text for tooltips or accessibility descriptions */
  readonly description?: string;
  /**
   * lucide icon name — resolved via ICON_MAP in the journey component.
   * TODO [INTEGRATION]: Currently unused in the subcategory picker UI. Wire up
   * to display a small icon on each subcategory toggle button in StepCategory.
   */
  readonly icon: string;
  readonly filters: readonly FilterConfig[];
};

export type MainCategory = {
  readonly id: string;
  readonly label: string;
  /** Short sub-text shown on category tile */
  readonly description: string;
  /** lucide icon name */
  readonly icon: string;
  /** tailwind bg class e.g. "bg-blue-100" */
  readonly iconBg: string;
  /** tailwind text class e.g. "text-blue-600" */
  readonly iconColor: string;
  readonly subcategories: readonly SubCategory[];
};

export type NotifyChannel = "email" | "whatsapp";

/**
 * Full location value from LocationPicker. Null when no location is set.
 * Shape mirrors LocationValue from @/components/location-picker — kept as a
 * standalone type here to avoid a circular dependency (types.ts is a pure data
 * module with no component imports).
 *
 * TODO [INTEGRATION]: If LocationValue shape changes in LocationPicker, update
 * this type to match. Consider a shared /types/location.ts to avoid drift.
 */
export type AlertLocation = {
  label: string;
  /** Secondary display line, e.g. city/country — mirrors LocationValue.sublabel */
  sublabel?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  unit?: "km" | "mi";
} | null;

export interface AlertPayload {
  mainCategory: MainCategory;
  subCategory: SubCategory;
  /** OR-matched keywords — alert fires if listing contains any */
  keywords: string[];
  /** Full location with coordinates. Null when not set. */
  location: AlertLocation;
  /** filterConfig.id → array of selected option values */
  filterValues: Record<string, string[]>;
  notifyChannels: NotifyChannel[];
}
