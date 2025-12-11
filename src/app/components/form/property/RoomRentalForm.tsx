// src/app/components/form/property/RoomRentalForm.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { cn as cx } from "@/lib/utils";
import { toast } from "sonner";

export default function RoomRentalForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  // form values from store (same fields as your original form)
  const roomType = usePostFormStore((s) => (s as any).type) ?? "";
  const name = usePostFormStore((s) => (s as any).name) ?? "";
  const description = usePostFormStore((s) => (s as any).description) ?? "";
  const rent = usePostFormStore((s) => (s as any).rent) ?? "";
  const deposit = usePostFormStore((s) => (s as any).deposit) ?? "";
  const available_from = usePostFormStore((s) => (s as any).available_from) ?? "";
  const preferred_tenants = usePostFormStore((s) => (s as any).preferred_tenants) ?? "";
  const gender_pref = usePostFormStore((s) => (s as any).gender_pref) ?? "";
  const amenities = (usePostFormStore((s) => (s as any).amenities) ?? []) as string[];
  const rules = (usePostFormStore((s) => (s as any).rules) ?? []) as string[];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amenitiesOptions = useMemo(
    () => [
      "WiFi",
      "Attached Bathroom",
      "Air Conditioning",
      "Kitchen Access",
      "Washing Machine",
      "TV/Smart TV",
      "Balcony",
      "Parking",
      "Housekeeping",
      "Meals Included",
    ],
    []
  );

  const rulesOptions = useMemo(
    () => ["Smoking Allowed", "Pets Allowed", "Guests Allowed"],
    []
  );

  const tenantPreferenceOptions = useMemo(
    () => ["Any", "Students", "Working Professionals", "Family"],
    []
  );

  const genderPreferenceOptions = useMemo(() => ["Any", "Male", "Female"], []);

  const roomTypeOptions = useMemo(
    () => ["Single Room", "Shared Room", "PG", "Hostel", "Other"],
    []
  );

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  // broadcast validation result (generic + legacy for safety)
  const dispatchValidated = (ok: boolean) => {
    ["postform:validated", "roomrentalform:validated"].forEach((evt) =>
      window.dispatchEvent(new CustomEvent(evt, { detail: { ok } }))
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    // ✅ Require Room Type
    if (!roomType) {
      mapped.type = "Please select a room type.";
    }

    // Basic validations (mirroring BuyForm style)
    if (!name.trim()) {
      mapped.name = "Listing title is required.";
    }

    if (!isPositive(rent)) {
      mapped.rent = "Please enter a valid monthly rent greater than 0.";
    }

    if (!available_from) {
      mapped.available_from = "Please select an available from date.";
    }

    // Optional numeric check for deposit if provided
    if (String(deposit).trim() && !isPositive(deposit)) {
      mapped.deposit = "Deposit must be a positive number.";
    }

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    dispatchValidated(true);
  };

  return (
    <form
      id="roomRentalForm" // 🔑 used by the template when submitting
      onSubmit={onSubmit}
      ref={formRef}
      className="w-full max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Add Room for Rent</h2>

      {/* Room Type */}
      <FormFieldContainer
        label="Room Type"
        htmlFor="type"
        error={errors.type}
        showFocusWithin={false}
      >
        <select
          id="type"
          name="type"
          value={roomType}
          onChange={(e) => setField("type", e.target.value)}
          className={cx(
            "flex h-10 w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
            !!errors.type && "border-red-500 focus-visible:ring-red-500/20"
          )}
        >
          <option value="">Select room type</option>
          {roomTypeOptions.map((opt) => (
            <option key={opt} value={opt.replace(/\s+/g, "")}>
              {opt}
            </option>
          ))}
        </select>
      </FormFieldContainer>

      {/* Title */}
      <FormFieldContainer
        label="Listing Title"
        htmlFor="name"
        error={errors.name}
        showFocusWithin={false}
      >
        <Input
          id="name"
          name="name"
          placeholder="e.g. Furnished Single Room near University"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
          className={cx(!!errors.name && "border-red-500 focus-visible:ring-red-500/20")}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer
        label="Description"
        htmlFor="description"
        error={errors.description}
        showFocusWithin={false}
      >
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the room…"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          className={cx(!!errors.description && "border-red-500 focus-visible:ring-red-500/20")}
        />
      </FormFieldContainer>

      {/* Pricing */}
      <FormFieldWrapper className="grid grid-cols-1 sm:grid-cols-2 gap-4" showFocusWithin={false}>
        <FormFieldContainer
          label="Monthly Rent (₹)"
          htmlFor="rent"
          error={errors.rent}
          showFocusWithin={false}
        >
          <Input
            id="rent"
            name="rent"
            type="number"
            placeholder="e.g. 8000"
            value={rent as any}
            onChange={(e) => setField("rent", e.target.value)}
            className={cx(!!errors.rent && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Deposit / Advance (₹)"
          htmlFor="deposit"
          error={errors.deposit}
          showFocusWithin={false}
        >
          <Input
            id="deposit"
            name="deposit"
            type="number"
            placeholder="e.g. 20000"
            value={deposit as any}
            onChange={(e) => setField("deposit", e.target.value)}
            className={cx(!!errors.deposit && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Availability */}
      <FormFieldContainer
        label="Available From"
        htmlFor="available_from"
        error={errors.available_from}
        showFocusWithin={false}
      >
        <Input
          id="available_from"
          name="available_from"
          type="date"
          value={available_from as any}
          onChange={(e) => setField("available_from", e.target.value)}
          className={cx(!!errors.available_from && "border-red-500 focus-visible:ring-red-500/20")}
        />
      </FormFieldContainer>

      {/* Preferences */}
      <FormFieldWrapper className="grid grid-cols-1 sm:grid-cols-2 gap-4" showFocusWithin={false}>
        <FormFieldContainer
          label="Tenant Preferences"
          htmlFor="preferred_tenants"
          error={errors.preferred_tenants}
          showFocusWithin={false}
        >
          <select
            id="preferred_tenants"
            name="preferred_tenants"
            value={preferred_tenants}
            onChange={(e) => setField("preferred_tenants", e.target.value)}
            className={cx(
              "flex h-10 w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
              !!errors.preferred_tenants && "border-red-500 focus-visible:ring-red-500/20"
            )}
          >
            <option value="">Select preference</option>
            {tenantPreferenceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FormFieldContainer>

        <FormFieldContainer
          label="Gender Preference"
          htmlFor="gender_pref"
          error={errors.gender_pref}
          showFocusWithin={false}
        >
          <select
            id="gender_pref"
            name="gender_pref"
            value={gender_pref}
            onChange={(e) => setField("gender_pref", e.target.value)}
            className={cx(
              "flex h-10 w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
              !!errors.gender_pref && "border-red-500 focus-visible:ring-red-500/20"
            )}
          >
            <option value="">Select gender preference</option>
            {genderPreferenceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Amenities */}
      <FormFieldContainer label="Amenities" htmlFor="amenities" helperLabel="Select all that apply" showFocusWithin={false}>
        <CheckboxGroupField label="" field="amenities" options={amenitiesOptions} cols={3} />
      </FormFieldContainer>

      {/* Rules */}
      <FormFieldContainer label="Rules" htmlFor="rules" showFocusWithin={false}>
        <CheckboxGroupField label="" field="rules" options={rulesOptions} cols={2} />
      </FormFieldContainer>

      {/* Hidden submit so requestSubmit works, same pattern as BuyForm */}
      <button type="submit" className="sr-only" aria-hidden />
    </form>
  );
}
