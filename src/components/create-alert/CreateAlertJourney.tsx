"use client";

import React, { useState } from "react";
import {
  // UI chrome + step icons
  ArrowRight, ChevronLeft, ChevronRight, Mail, MessageCircle, MapPin, Sparkles, LayoutGrid,
  // Category icons
  Building2, Car, Briefcase, Wrench, ShoppingBag, PawPrint,
  TrendingUp, Users, Tag,
  GraduationCap, HeartPulse, UtensilsCrossed, Plane, Baby, Dumbbell, Smartphone, Home, Shirt,
} from "lucide-react";
import {
  Outline_UnCheckCircle_24by24,
  Outline_CheckCircle_24by24,
} from "@/components/icons/la-icons";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { LocationPicker } from "@/components/location-picker";
import type { LocationValue } from "@/components/location-picker";
import { Switch } from "@/components/ui/switch";
import { LaButton, LaTagInput } from "@/components/la";
import { cn } from "@/lib/utils";
import { ALERT_CONFIG } from "./alert-config";
import type {
  MainCategory,
  SubCategory,
  FilterConfig,
  NotifyChannel,
  AlertPayload,
} from "./types";

// ── Icon map ──────────────────────────────────────────────────────────────────

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  property:          Building2,
  vehicles:          Car,
  jobs:              Briefcase,
  services:          Wrench,
  for_sale:          ShoppingBag,
  pets:              PawPrint,
  business:          TrendingUp,
  community:         Users,
  special_offers:    Tag,
  education:         GraduationCap,
  health_beauty:     HeartPulse,
  food_dining:       UtensilsCrossed,
  travel_stays:      Plane,
  baby_kids:         Baby,
  sports_outdoors:   Dumbbell,
  electronics_tech:  Smartphone,
  home_furniture:    Home,
  fashion_clothing:  Shirt,
};

// Toned-down mid-soft colors — readable with white text, not overpowering
// NOTE: Only approved palette families used (see components/la/COLOR_PALETTE.md)
const CATEGORY_BG: Record<string, string> = {
  property:          "bg-blue-400",
  vehicles:          "bg-amber-400",
  jobs:              "bg-purple-400",
  services:          "bg-sky-500",
  for_sale:          "bg-amber-500",
  pets:              "bg-rose-400",
  business:          "bg-emerald-500",
  community:         "bg-yellow-500",
  special_offers:    "bg-rose-500",
  education:         "bg-indigo-400",
  health_beauty:     "bg-pink-400",
  food_dining:       "bg-orange-400",
  travel_stays:      "bg-cyan-500",
  baby_kids:         "bg-pink-300",
  sports_outdoors:   "bg-green-500",
  electronics_tech:  "bg-slate-500",
  home_furniture:    "bg-teal-500",
  fashion_clothing:  "bg-fuchsia-400",
};

const DEFAULT_NOTIFY: NotifyChannel[] = ["email", "whatsapp"];
const ALL_NOTIFY_CHANNELS: NotifyChannel[] = ["email", "whatsapp"];

// ── Step progress bar ─────────────────────────────────────────────────────────

const STEP_CONFIG = [
  { bar: "bg-rose-500",    barDone: "bg-rose-300"    },
  { bar: "bg-pink-500",    barDone: "bg-pink-300"    },
  { bar: "bg-emerald-500", barDone: "bg-emerald-300" },
] as const;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5 px-1 pb-1 shrink-0">
      {STEP_CONFIG.map((s, i) => {
        const n = i + 1;
        return (
          <div key={n} className="flex-1">
            <div
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                step > n   ? s.barDone :
                step === n ? s.bar     :
                "bg-slate-200",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}


// ── Step 1: Combined category + sub-category (single screen) ─────────────────

interface StepCategoryProps {
  mainCategory: MainCategory | null;
  subCategory: SubCategory | null;
  onMainChange: (cat: MainCategory) => void;
  onSubChange: (sub: SubCategory) => void;
  onResetCategory: () => void;
  onNext: () => void;
  isPopup: boolean;
}

function StepCategory({
  mainCategory,
  subCategory,
  onMainChange,
  onSubChange,
  onResetCategory,
  onNext,
  isPopup,
}: StepCategoryProps) {
  const canProceed = mainCategory !== null && subCategory !== null;

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-2 bg-slate-100">

        {/* ── Phase A: no selection yet — icon card grid ── */}
        {!mainCategory && (
          <div className="flex flex-col items-center px-3 pt-3 pb-2 gap-3">
            <p className="text-base font-semibold text-slate-700 text-center self-center">Select a category</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              {ALERT_CONFIG.map((cat) => {
                const CatIcon = CATEGORY_ICON_MAP[cat.id] ?? LayoutGrid;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onMainChange(cat)}
                    className="relative bg-white rounded-2xl border border-slate-300 px-2 pt-3 pb-2.5 flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 active:scale-[0.97] transition-transform"
                  >
                    {/* Tiny arrow — top right */}
                    <ChevronRight className="absolute top-2 right-2 w-3 h-3 text-slate-400" />

                    {/* Coloured circle + icon */}
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", CATEGORY_BG[cat.id] ?? "bg-slate-400")}>
                      <CatIcon className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <p className="w-full text-center text-sm font-bold text-slate-900 leading-tight truncate px-1">{cat.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Phase B: category chosen — strip + sub-category ── */}
        {mainCategory && (
          <div className="flex flex-col pt-5 gap-6">

            {/* Selected category chip — tap to go back */}
            <div className="px-5 flex justify-center">
              <LaButton
                intent="ghost"
                size="big"
                onClick={onResetCategory}
                className="gap-1.5 bg-sky-600 text-white border border-sky-700 hover:bg-sky-700"
              >
                <ChevronLeft className="h-4 w-4" />
                {mainCategory.label}
              </LaButton>
            </div>

            {/* Sub-category — default size, centre aligned */}
            <div className="flex flex-col gap-3 px-5">
              <p className="text-base font-semibold text-slate-700 text-center">
                Which type of {mainCategory.label}?
              </p>
              <ToggleButtonGroup
                singleSelect
                requireSelection
                value={subCategory ? [subCategory.id] : []}
                onChange={(vals) => {
                  const found = mainCategory.subcategories.find((s) => s.id === vals[0]);
                  if (found) onSubChange(found);
                }}
                className="gap-0"
              >
                <div className="w-full flex flex-wrap justify-center gap-2.5">
                  {mainCategory.subcategories.map((sub) => (
                    <ToggleGroupButton key={sub.id} value={sub.id} size="default">
                      {sub.label}
                    </ToggleGroupButton>
                  ))}
                </div>
              </ToggleButtonGroup>
            </div>

          </div>
        )}

      </div>

      {/* Footer — Next enables only when both are selected */}
      <div
        className={cn(
          "shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6",
          isPopup && "pb-5",
        )}
      >
        <LaButton
          intent="primary-blue"
          size="big"
          className="w-full"
          disabled={!canProceed}
          onClick={onNext}
        >
          Set Preferences
          <ArrowRight className="h-4 w-4" />
        </LaButton>
      </div>
    </>
  );
}

// ── Dynamic filter row ────────────────────────────────────────────────────────

interface DynamicFilterRowProps {
  filter: FilterConfig;
  value: string[];
  onChange: (vals: string[]) => void;
}

function DynamicFilterRow({ filter, value, onChange }: DynamicFilterRowProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">{filter.label}</p>
      <ToggleButtonGroup
        singleSelect={filter.singleSelect}
        value={value}
        onChange={onChange}
        className="gap-0"
      >
        <div className="flex flex-wrap gap-2">
          {filter.options.map((opt) => (
            <ToggleGroupButton
              key={opt.value}
              value={opt.value}
              icon={Outline_UnCheckCircle_24by24}
              iconSelected={Outline_CheckCircle_24by24}
              size="default"
            >
              {opt.label}
            </ToggleGroupButton>
          ))}
        </div>
      </ToggleButtonGroup>
    </div>
  );
}

// ── Step 2: Filters ───────────────────────────────────────────────────────────

interface StepFiltersProps {
  subCategory: SubCategory;
  keywords: string[];
  locationValue: LocationValue | null;
  filterValues: Record<string, string[]>;
  onKeywordsChange: (tags: string[]) => void;
  onLocationChange: (v: LocationValue | null) => void;
  onFilterChange: (id: string, vals: string[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isPopup: boolean;
}

function StepFilters({
  subCategory,
  keywords,
  locationValue,
  filterValues,
  onKeywordsChange,
  onLocationChange,
  onFilterChange,
  onBack,
  onSubmit,
  isSubmitting,
  isPopup,
}: StepFiltersProps) {
  // At least one of: keyword, filter, or location must be set to enable submission.
  const canSubmit = keywords.length > 0 || Object.values(filterValues).some((v) => v.length > 0) || locationValue !== null;

  return (
    <>
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="space-y-5 pt-2">

          {/* Keywords */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">Keywords</p>
            <LaTagInput
              value={keywords}
              onChange={onKeywordsChange}
              placeholder={`e.g. ${subCategory.label}, brand name…`}
              maxTags={5}
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-700">Location</p>
            <LocationPicker
              value={locationValue}
              onChange={onLocationChange}
              placeholder="Select a location"
              showRadius={false}
              trigger="link"
              triggerClassName="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            />
          </div>

          {/* Dynamic attribute filters */}
          {subCategory.filters.map((filter) => (
            <DynamicFilterRow
              key={filter.id}
              filter={filter}
              value={filterValues[filter.id] ?? []}
              onChange={(vals) => onFilterChange(filter.id, vals)}
            />
          ))}

        </div>
      </div>

      {/* Sticky footer */}
      <div
        className={cn(
          "shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6",
          isPopup && "pb-5",
        )}
      >
        <div className="flex items-center gap-2">
          <LaButton intent="secondary" size="default" className="shrink-0" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </LaButton>
          <LaButton
            intent="primary-blue"
            size="default"
            className="flex-1"
            disabled={!canSubmit}
            loading={isSubmitting}
            onClick={onSubmit}
          >
            <Sparkles className="h-4 w-4" />
            Create Alert
          </LaButton>
        </div>
      </div>
    </>
  );
}

// ── Step 3: Done ──────────────────────────────────────────────────────────────

interface StepDoneProps {
  mainCategory: MainCategory;
  subCategory: SubCategory;
  keywords: string[];
  locationValue: LocationValue | null;
  filterValues: Record<string, string[]>;
  notifyChannels: NotifyChannel[];
  onNotifyChange: (channels: NotifyChannel[]) => void;
  onComplete?: () => void;
  isPopup: boolean;
}

function StepDone({
  mainCategory,
  subCategory,
  keywords,
  locationValue,
  filterValues,
  notifyChannels,
  onNotifyChange,
  onComplete,
  isPopup,
}: StepDoneProps) {
  const [showNotifyError, setShowNotifyError] = useState(false);
  const errorTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the error flash timer on unmount to avoid state updates on dead component.
  React.useEffect(() => {
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); };
  }, []);

  const handleNotifyChange = (checked: boolean, channel: NotifyChannel) => {
    const next = checked
      ? [...new Set([...notifyChannels, channel])]
      : notifyChannels.filter((c) => c !== channel);
    if (next.length === 0) {
      // Auto-enable the other channel + flash hint red so user knows what happened
      const other = ALL_NOTIFY_CHANNELS.find((c) => c !== channel)!;
      onNotifyChange([other]);
      setShowNotifyError(true);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setShowNotifyError(false), 2000);
      return;
    }
    onNotifyChange(next);
  };

  const filterChips = subCategory.filters.flatMap((f) => {
    const vals = filterValues[f.id] ?? [];
    return vals.map((v) => ({
      key:   `${f.id}__${v}`,
      label: f.options.find((o) => o.value === v)?.label ?? v,
    }));
  });

  return (
    <>
      {/* ── Zone 1: Heading ──────────────────────────────────────────── */}
      <div className="shrink-0 bg-blue-700 px-6 pt-6 pb-6 text-center">
        <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-1">Alert Created</p>
        <h3 className="text-xl font-bold text-white leading-snug">
          Alert&apos;s live. We&apos;ll ping you.
        </h3>
      </div>

      {/* ── Zone 2: Scrollable body ───────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-slate-100 px-4 py-4 space-y-3">

        {/* Summary card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">

          {/* Category row */}
          <div className="px-4 py-3.5">
            <p className="text-sm font-medium text-slate-600 mb-1.5">Watching for</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">{mainCategory.label}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              <span className="text-sm font-semibold text-slate-900">{subCategory.label}</span>
            </div>
          </div>

          {/* Filters row */}
          {filterChips.length > 0 && (
            <div className="px-4 py-3.5">
              <p className="text-sm font-medium text-slate-600 mb-2">Filters</p>
              <div className="flex flex-wrap gap-1.5">
                {filterChips.map(({ key, label }) => (
                  <span key={key} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm font-medium text-indigo-700">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords row */}
          {keywords.length > 0 && (
            <div className="px-4 py-3.5">
              <p className="text-sm font-medium text-slate-600 mb-2">Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-700">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location row */}
          {locationValue && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-600 mb-0.5">Location</p>
                <p className="text-sm font-semibold text-slate-900">{locationValue.label}</p>
              </div>
            </div>
          )}

        </div>

        {/* Notify card — compact, label only */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
          {/* Hint row */}
          <div className="px-4 pt-3 pb-1">
            <p className="text-sm font-semibold text-slate-800">Notify me via</p>
            <p className={cn("text-sm italic font-light transition-colors duration-200", showNotifyError ? "text-rose-500" : "text-slate-500")}>
              At least one must be on.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">Email</span>
            </div>
            <Switch
              checked={notifyChannels.includes("email")}
              onCheckedChange={(checked: boolean) => handleNotifyChange(checked, "email")}
              // TODO [INTEGRATION]: Disable email toggle if user has no verified email on account
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <MessageCircle className="h-4 w-4 text-lime-600" />
              <span className="text-sm font-semibold text-slate-800">WhatsApp</span>
            </div>
            <Switch
              checked={notifyChannels.includes("whatsapp")}
              onCheckedChange={(checked: boolean) => handleNotifyChange(checked, "whatsapp")}
              // TODO [INTEGRATION]: Disable WhatsApp toggle if user has no verified phone number on account
            />
          </div>
        </div>

      </div>

      {/* ── Zone 3: Fixed footer ──────────────────────────────────────── */}
      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6", isPopup && "pb-5")}>
        <div className="flex items-center gap-2">
          <LaButton intent="secondary" size="default" className="shrink-0" onClick={onComplete}>
            Maybe later
          </LaButton>
          {/* TODO [INTEGRATION]: Navigate to /my-alerts or open alerts management page */}
          <LaButton intent="primary-blue" size="default" className="flex-1" onClick={onComplete}>
            Manage Alerts
          </LaButton>
        </div>
      </div>
    </>
  );
}

// ── Main journey component ────────────────────────────────────────────────────

interface CreateAlertJourneyProps {
  className?: string;
  onSubmit?: (payload: AlertPayload) => Promise<void> | void;
  onComplete?: () => void;
  layout?: "default" | "popup";
}

export default function CreateAlertJourney({
  className,
  onSubmit,
  onComplete,
  layout = "default",
}: CreateAlertJourneyProps) {
  const [step, setStep]                     = useState(1);
  const [mainCategory, setMainCategory]     = useState<MainCategory | null>(null);
  const [subCategory, setSubCategory]       = useState<SubCategory  | null>(null);
  const [keywords, setKeywords]             = useState<string[]>([]);
  const [location, setLocation]             = useState<LocationValue | null>(null);
  const [filterValues, setFilterValues]     = useState<Record<string, string[]>>({});
  const [notifyChannels, setNotifyChannels] = useState<NotifyChannel[]>(DEFAULT_NOTIFY);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  const isPopup = layout === "popup";

  const handleMainChange = (cat: MainCategory) => {
    setMainCategory(cat);
    setSubCategory(null);
    setFilterValues({});
  };

  const handleResetCategory = () => {
    setMainCategory(null);
    setSubCategory(null);
    setFilterValues({});
  };

  const handleSubChange = (sub: SubCategory) => {
    setSubCategory(sub);
    setFilterValues({});
  };

  const handleBackToStep1 = () => setStep(1);

  const handleFilterChange = (id: string, vals: string[]) =>
    setFilterValues((prev) => ({ ...prev, [id]: vals }));

  const handleSubmit = async () => {
    if (!mainCategory || !subCategory) return;
    const payload: AlertPayload = {
      mainCategory,
      subCategory,
      keywords,
      location,
      filterValues,
      notifyChannels,
    };
    setIsSubmitting(true);
    try {
      // TODO [INTEGRATION]: POST to /api/alerts — replace onSubmit? callback with real API call.
      // Expected response: { alertId: string } — use to deep-link "Manage Alerts" to the right alert.
      await onSubmit?.(payload);
      setStep(3);
    } catch {
      // TODO [INTEGRATION]: Show error toast — e.g. "Failed to create alert. Please try again."
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerTitle =
    step === 1 ? "What's the alert for?" :
    step === 2 ? "Set your preferences"            :
    null;

  const headerSub: React.ReactNode =
    step === 1 ? <>Pick <strong>category</strong> and <strong>sub category</strong></> :
    step === 2 ? "All filters are optional" :
    null;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",
        isPopup && "rounded-none border-0 shadow-none",
        className,
      )}
    >
      {/* Header */}
      {step < 3 && (
        <div className="shrink-0 px-5 pt-2 pb-2">
          <h2 className="text-lg font-semibold text-slate-800">{headerTitle}</h2>
          <p className="text-sm text-slate-500">{headerSub}</p>
        </div>
      )}

      {/* Progress bar */}
      {step < 3 && <ProgressBar step={step} />}

      {/* Step 1 — combined category + sub-category */}
      {step === 1 && (
        <StepCategory
          mainCategory={mainCategory}
          subCategory={subCategory}
          onMainChange={handleMainChange}
          onSubChange={handleSubChange}
          onResetCategory={handleResetCategory}
          onNext={() => setStep(2)}
          isPopup={isPopup}
        />
      )}

      {/* Step 2 — filters */}
      {step === 2 && subCategory && (
        <StepFilters
          subCategory={subCategory}
          keywords={keywords}
          locationValue={location}
          filterValues={filterValues}
          onKeywordsChange={setKeywords}
          onLocationChange={setLocation}
          onFilterChange={handleFilterChange}
          onBack={handleBackToStep1}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isPopup={isPopup}
        />
      )}

      {/* Step 3 — confirmation */}
      {step === 3 && mainCategory && subCategory && (
        <StepDone
          mainCategory={mainCategory}
          subCategory={subCategory}
          keywords={keywords}
          locationValue={location}
          filterValues={filterValues}
          notifyChannels={notifyChannels}
          onNotifyChange={setNotifyChannels}
          onComplete={onComplete}
          isPopup={isPopup}
        />
      )}
    </div>
  );
}
