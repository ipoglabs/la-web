// /src/app/components/form/property/BuyForm.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { toast } from "sonner";

// tiny helper to merge classes (same idea as register page)
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function BuyForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const salePrice = usePostFormStore((s) => s.salePrice) ?? "";
  const builtup_area = usePostFormStore((s) => s.builtup_area) ?? "";
  const carpet_area = usePostFormStore((s) => s.carpet_area) ?? "";
  const facilities = (usePostFormStore((s) => s.facilities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const facilitiesOptions = useMemo(
    () => ["Parking", "Gym", "Swimming Pool", "Garden"],
    []
  );

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  // let parent page know validation status
  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("buyform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mappedErrors: Record<string, string>) => {
    const firstErrorField = Object.keys(mappedErrors)[0];
    if (!firstErrorField) return;

    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${firstErrorField}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    (el as HTMLElement | null)?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // normalize (same pattern as register form)
    const title = (name || "").trim();
    const desc = (description || "").trim();
    const price = salePrice; // keep raw; validation checks numeric
    const built = builtup_area;
    const carpet = carpet_area;

    const mapped: Record<string, string> = {};

    // friendly validations (register-style)
    if (!title) mapped.name = "Please enter a listing title.";
    if (!desc) mapped.description = "Please add a short description.";

    if (!isPositive(price)) {
      mapped.salePrice = "Please enter a valid sale price greater than 0.";
    }

    if (String(built).trim() && !isPositive(built)) {
      mapped.builtup_area = "Built-up area must be a positive number.";
    }

    if (String(carpet).trim() && !isPositive(carpet)) {
      mapped.carpet_area = "Carpet area must be a positive number.";
    }

    // (optional) facilities required check – keep off unless you want it strict
    // if (!facilities?.length) mapped.facilities = "Please select at least one facility.";

    if (Object.keys(mapped).length > 0) {
      setErrors(mapped);
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    // Save normalized values back (nice to keep store clean)
    setField("name", title);
    setField("description", desc);
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="buyForm"
      onSubmit={onSubmit}
      ref={formRef}
      className="w-full max-w-xl space-y-6"
    >
      {/* Basic Info */}
      <FormFieldContainer
        label="Listing Title"
        htmlFor="name"
        error={errors.name}
        showFocusWithin={false}
      >
        <Input
          id="name"
          name="name"
          placeholder="e.g. 2BHK Apartment in Anna Nagar"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cx(
            !!errors.name && "border-red-500 focus-visible:ring-red-500/20"
          )}
        />
      </FormFieldContainer>

      <FormFieldContainer
        label="Description"
        htmlFor="description"
        error={errors.description}
        showFocusWithin={false}
      >
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the property…"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={cx(
            !!errors.description && "border-red-500 focus-visible:ring-red-500/20"
          )}
        />
      </FormFieldContainer>

      {/* Pricing & Area */}
      <FormFieldWrapper
        className="grid grid-cols-1 md:grid-cols-3 md:gap-4"
        showFocusWithin={false}
      >
        <FormFieldContainer
          label="Sale Price (₹)"
          htmlFor="salePrice"
          error={errors.salePrice}
          showFocusWithin={false}
        >
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            placeholder="e.g. 6500000"
            value={salePrice as any}
            onChange={(e) => setField("salePrice", e.target.value)}
            aria-invalid={!!errors.salePrice}
            aria-describedby={errors.salePrice ? "salePrice-error" : undefined}
            className={cx(
              !!errors.salePrice && "border-red-500 focus-visible:ring-red-500/20"
            )}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Built-up Area (sq ft)"
          htmlFor="builtup_area"
          error={errors.builtup_area}
          showFocusWithin={false}
        >
          <Input
            id="builtup_area"
            name="builtup_area"
            type="number"
            value={builtup_area as any}
            onChange={(e) => setField("builtup_area", e.target.value)}
            aria-invalid={!!errors.builtup_area}
            aria-describedby={errors.builtup_area ? "builtup_area-error" : undefined}
            className={cx(
              !!errors.builtup_area &&
                "border-red-500 focus-visible:ring-red-500/20"
            )}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Carpet Area (sq ft)"
          htmlFor="carpet_area"
          error={errors.carpet_area}
          showFocusWithin={false}
        >
          <Input
            id="carpet_area"
            name="carpet_area"
            type="number"
            value={carpet_area as any}
            onChange={(e) => setField("carpet_area", e.target.value)}
            aria-invalid={!!errors.carpet_area}
            aria-describedby={errors.carpet_area ? "carpet_area-error" : undefined}
            className={cx(
              !!errors.carpet_area &&
                "border-red-500 focus-visible:ring-red-500/20"
            )}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Facilities */}
      <FormFieldContainer
        label="Facilities"
        htmlFor="facilities"
        helperLabel="Select all that apply"
        error={errors.facilities} // safe even if you don't set it
        showFocusWithin={false}
      >
        <CheckboxGroupField
          label=""
          field="facilities"
          options={facilitiesOptions}
          cols={3}
        />
      </FormFieldContainer>

      {/* Hidden submit so requestSubmit works */}
      <button type="submit" className="sr-only" aria-hidden />
    </form>
  );
}
