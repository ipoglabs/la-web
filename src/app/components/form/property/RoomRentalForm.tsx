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

  const roomType = usePostFormStore((s) => (s as any).type) ?? "";
  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";

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

  const genderPreferenceOptions = useMemo(
    () => ["Any", "Male", "Female"],
    []
  );

  const roomTypeOptions = useMemo(
    () => ["Single Room", "Shared Room", "PG", "Hostel", "Other"],
    []
  );

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("roomrentalform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    const title = name.trim();
    const desc = description.trim();

    if (!roomType) mapped.type = "Please select a room type.";
    if (!title) mapped.name = "Listing title is required.";
    if (!desc) mapped.description = "Description is required.";

    if (!isPositive(rent)) mapped.rent = "Rent must be greater than 0.";
    if (!available_from) mapped.available_from = "Select available date.";

    if (deposit && !isPositive(deposit))
      mapped.deposit = "Deposit must be positive.";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    // ✅ IMPORTANT: persist trimmed values
    setField("name", title);
    setField("description", desc);

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="roomRentalForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">
        Add Room for Rent
      </h2>

      {/* Room Type */}
      <FormFieldContainer label="Room Type" htmlFor="type" error={errors.type}>
        <select
          id="type"
          name="type"
          value={roomType}
          onChange={(e) => setField("type", e.target.value)}
          className={cx("w-full border px-3 py-2 rounded", errors.type && "border-red-500")}
        >
          <option value="">Select room type</option>
          {roomTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </FormFieldContainer>

      {/* Title */}
      <FormFieldContainer label="Listing Title" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Description" htmlFor="description" error={errors.description}>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </FormFieldContainer>

      {/* Rent */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Rent (₹)" htmlFor="rent" error={errors.rent}>
          <Input
            id="rent"
            name="rent"
            type="number"
            value={rent as any}
            onChange={(e) => setField("rent", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Deposit" htmlFor="deposit">
          <Input
            id="deposit"
            name="deposit"
            type="number"
            value={deposit as any}
            onChange={(e) => setField("deposit", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Available */}
      <FormFieldContainer label="Available From" htmlFor="available_from" error={errors.available_from}>
        <Input
          id="available_from"
          name="available_from"
          type="date"
          value={available_from as any}
          onChange={(e) => setField("available_from", e.target.value)}
        />
      </FormFieldContainer>

      {/* Preferences */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Preferred Tenants">
          <select
            value={preferred_tenants}
            onChange={(e) => setField("preferred_tenants", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select</option>
            {tenantPreferenceOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </FormFieldContainer>

        <FormFieldContainer label="Gender Preference">
          <select
            value={gender_pref}
            onChange={(e) => setField("gender_pref", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select</option>
            {genderPreferenceOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Amenities */}
      <FormFieldContainer label="Amenities">
        <CheckboxGroupField field="amenities" options={amenitiesOptions} cols={3} />
      </FormFieldContainer>

      {/* Rules */}
      <FormFieldContainer label="Rules">
        <CheckboxGroupField field="rules" options={rulesOptions} cols={2} />
      </FormFieldContainer>

      <button type="submit" className="sr-only" />
    </form>
  );
}
