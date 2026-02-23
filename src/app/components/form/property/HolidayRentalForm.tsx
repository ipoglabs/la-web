"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { toast } from "sonner";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function HolidayRentalForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const setField = usePostFormStore((s) => s.setField);
  const store = usePostFormStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  /** ---------- OPTIONS ---------- */

  const holidayTypes = [
    { value: "Villa", label: "Villa" },
    { value: "BeachHouse", label: "Beach House" },
    { value: "Cottage", label: "Cottage" },
    { value: "Resort", label: "Resort" },
    { value: "GuestHouse", label: "Guest House" },
    { value: "FarmStay", label: "Farm Stay" },
    { value: "Treehouse", label: "Treehouse" },
    { value: "Other", label: "Other" },
  ];

  const amenityOptions = useMemo(
    () => [
      "WiFi",
      "Swimming Pool",
      "Air Conditioning",
      "Free Parking",
      "BBQ Grill",
      "Outdoor Dining",
      "Private Beach",
      "Kitchen",
      "Washing Machine",
      "TV",
      "Garden",
      "Fireplace",
      "Pet Friendly",
    ],
    []
  );

  const ruleOptions = useMemo(
    () => [
      "Smoking Allowed",
      "Pets Allowed",
      "Parties Allowed",
      "Children Friendly",
    ],
    []
  );

  /** ---------- HELPERS ---------- */

  const setAndClear = (key: string, value: any) => {
    setField(key, value);
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const isPositive = (v: any) => Number(v) > 0;

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el = formRef.current?.querySelector(`[name="${first}"]`);
    (el as HTMLElement)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /** ---------- SUBMIT ---------- */

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!store.name) mapped.name = "Please enter title";
    if (!store.description) mapped.description = "Please enter description";
    if (!store.holidayType)
      mapped.holidayType = "Select property type";

    if (!isPositive(store.guests))
      mapped.guests = "Guests must be greater than 0";

    if (!isPositive(store.beds))
      mapped.beds = "Beds must be greater than 0";

    if (!isPositive(store.baths))
      mapped.baths = "Baths must be greater than 0";

    if (!isPositive(store.rateNightly))
      mapped.rateNightly = "Nightly rate must be greater than 0";

    if (Object.keys(mapped).length > 0) {
      setErrors(mapped);
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields");
      dispatchValidated(false);
      return;
    }

    setErrors({});
    dispatchValidated(true);
  };

  /** ---------- UI ---------- */

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      {/* Title */}
      <FormFieldContainer label="Listing Title" error={errors.name}>
        <Input
          name="name"
          value={store.name || ""}
          onChange={(e) => setAndClear("name", e.target.value)}
          className={cx(errors.name && "border-red-500")}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Description" error={errors.description}>
        <Textarea
          name="description"
          value={store.description || ""}
          onChange={(e) => setAndClear("description", e.target.value)}
          className={cx(errors.description && "border-red-500")}
        />
      </FormFieldContainer>

      {/* Holiday Type */}
      <FormFieldContainer label="Holiday Property Type" error={errors.holidayType}>
        <select
          name="holidayType"
          value={store.holidayType || ""}
          onChange={(e) => setAndClear("holidayType", e.target.value)}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Select</option>
          {holidayTypes.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormFieldContainer>

      {/* Capacity */}
      <FormFieldWrapper className="grid grid-cols-3 gap-4">
        <Input
          name="guests"
          type="number"
          placeholder="Guests"
          value={store.guests || ""}
          onChange={(e) => setAndClear("guests", e.target.value)}
        />
        <Input
          name="beds"
          type="number"
          placeholder="Beds"
          value={store.beds || ""}
          onChange={(e) => setAndClear("beds", e.target.value)}
        />
        <Input
          name="baths"
          type="number"
          placeholder="Baths"
          value={store.baths || ""}
          onChange={(e) => setAndClear("baths", e.target.value)}
        />
      </FormFieldWrapper>

      {/* Rates */}
      <FormFieldWrapper className="grid grid-cols-3 gap-4">
        <Input
          name="rateNightly"
          type="number"
          placeholder="Nightly ₹"
          value={store.rateNightly || ""}
          onChange={(e) => setAndClear("rateNightly", e.target.value)}
        />
        <Input
          name="rateWeekly"
          type="number"
          placeholder="Weekly ₹"
          value={store.rateWeekly || ""}
          onChange={(e) => setAndClear("rateWeekly", e.target.value)}
        />
        <Input
          name="rateMonthly"
          type="number"
          placeholder="Monthly ₹"
          value={store.rateMonthly || ""}
          onChange={(e) => setAndClear("rateMonthly", e.target.value)}
        />
      </FormFieldWrapper>

      {/* Amenities */}
      <FormFieldContainer label="Amenities">
        <CheckboxGroupField
          field="amenities"
          options={amenityOptions}
          cols={3}
        />
      </FormFieldContainer>

      {/* House Rules */}
      <FormFieldContainer label="House Rules">
        <CheckboxGroupField
          field="house_rules"
          options={ruleOptions}
          cols={2}
        />
      </FormFieldContainer>

      {/* Hidden submit */}
      <button type="submit" className="hidden" />
    </form>
  );
}
