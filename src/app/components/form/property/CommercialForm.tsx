"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { toast } from "sonner";
import { usePostFormStore } from "@/app/post/store/postFormStore";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const PROPERTY_TYPES = [
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "showroom", label: "Showroom" },
  { value: "industrial", label: "Industrial" },
  { value: "coworking", label: "Co-working" },
];

const FURNISHING = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi", label: "Semi-furnished" },
  { value: "furnished", label: "Furnished" },
];

const PANTRY = [
  { value: "none", label: "None" },
  { value: "dry", label: "Dry Pantry" },
  { value: "wet", label: "Wet Pantry" },
];

const POWER_BACKUP = [
  { value: "none", label: "None" },
  { value: "partial", label: "Partial" },
  { value: "full", label: "Full" },
];

export default function CommercialForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => (s as any).name) ?? "";
  const description = usePostFormStore((s) => (s as any).description) ?? "";

  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const builtup_area = usePostFormStore((s) => (s as any).builtup_area) ?? "";
  const carpet_area = usePostFormStore((s) => (s as any).carpet_area) ?? "";

  const floor = usePostFormStore((s) => (s as any).floor) ?? "";
  const totalFloors = usePostFormStore((s) => (s as any).totalFloors) ?? "";
  const furnishing = usePostFormStore((s) => (s as any).furnishing) ?? "";

  const washrooms = usePostFormStore((s) => (s as any).washrooms) ?? "";
  const pantry = usePostFormStore((s) => (s as any).pantry) ?? "";
  const parkingSpaces = usePostFormStore((s) => (s as any).parkingSpaces) ?? "";

  const rentPrice = usePostFormStore((s) => (s as any).rentPrice) ?? "";
  const deposit = usePostFormStore((s) => (s as any).deposit) ?? "";
  const maintenance = usePostFormStore((s) => (s as any).maintenance) ?? "";

  const available_from = usePostFormStore((s) => (s as any).available_from) ?? "";
  const leaseTerm = usePostFormStore((s) => (s as any).leaseTerm) ?? "";
  const powerBackup = usePostFormStore((s) => (s as any).powerBackup) ?? "";

  const facilities =
    (usePostFormStore((s) => (s as any).facilities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const facilitiesOptions = useMemo(
    () => ["Parking", "Lift", "Power Backup", "Security/CCTV", "Fire Safety", "Visitor Parking"],
    []
  );

  const setAndClear = (key: string, value: any) => {
    setField(key, value);
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const isNonNegative = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("commercialform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mappedErrors: Record<string, string>) => {
    const first = Object.keys(mappedErrors)[0];
    if (!first) return;

    const byName = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    if (byName) {
      byName.scrollIntoView({ behavior: "smooth", block: "center" });
      byName.focus?.();
      return;
    }

    const byId = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(first)}`);
    if (byId) {
      byId.scrollIntoView({ behavior: "smooth", block: "center" });
      byId.focus?.();
      return;
    }

    if (first === "facilities") {
      const box = document.getElementById("facilities-block");
      box?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = String(name ?? "").trim();
    const desc = String(description ?? "").trim();

    const mapped: Record<string, string> = {};

    if (!title) mapped.name = "Please enter a listing title.";
    if (!desc) mapped.description = "Please add a description.";

    if (!propertyType) mapped.propertyType = "Please select property type.";
    if (!isPositive(rentPrice)) mapped.rentPrice = "Monthly rent must be greater than 0.";

    if (String(builtup_area).trim() && !isPositive(builtup_area))
      mapped.builtup_area = "Built-up area must be a positive number.";

    if (String(carpet_area).trim() && !isPositive(carpet_area))
      mapped.carpet_area = "Carpet area must be a positive number.";

    if (String(floor).trim() && !isNonNegative(floor))
      mapped.floor = "Floor must be 0 or more.";

    if (String(totalFloors).trim() && !isPositive(totalFloors))
      mapped.totalFloors = "Total floors must be greater than 0.";

    if (String(washrooms).trim() && !isNonNegative(washrooms))
      mapped.washrooms = "Washrooms must be 0 or more.";

    if (String(parkingSpaces).trim() && !isNonNegative(parkingSpaces))
      mapped.parkingSpaces = "Parking spaces must be 0 or more.";

    if (String(deposit).trim() && !isNonNegative(deposit))
      mapped.deposit = "Deposit must be 0 or more.";

    if (String(maintenance).trim() && !isNonNegative(maintenance))
      mapped.maintenance = "Maintenance must be 0 or more.";

    if (String(leaseTerm).trim() && !isPositive(leaseTerm))
      mapped.leaseTerm = "Lease term must be greater than 0.";

    if (Object.keys(mapped).length > 0) {
      setErrors(mapped);
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", title);
    setField("description", desc);

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="commercialForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      {/* Basic */}
      <FormFieldContainer label="Listing Title" htmlFor="name" error={errors.name} showFocusWithin={false}>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Commercial Office Space in T. Nagar"
          value={name}
          onChange={(e) => setAndClear("name", e.target.value)}
          aria-invalid={!!errors.name}
          className={cx(!!errors.name && "border-red-500 focus-visible:ring-red-500/20")}
        />
      </FormFieldContainer>

      <FormFieldContainer label="Description" htmlFor="description" error={errors.description} showFocusWithin={false}>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the space, highlights, connectivity, etc."
          value={description}
          onChange={(e) => setAndClear("description", e.target.value)}
          rows={5}
          aria-invalid={!!errors.description}
          className={cx(!!errors.description && "border-red-500 focus-visible:ring-red-500/20")}
        />
      </FormFieldContainer>

      {/* Property type */}
      <FormFieldContainer label="Property Type" htmlFor="propertyType" error={errors.propertyType} showFocusWithin={false}>
        <select
          id="propertyType"
          name="propertyType"
          value={propertyType}
          onChange={(e) => setAndClear("propertyType", e.target.value)}
          aria-invalid={!!errors.propertyType}
          className={cx(
            "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
            !!errors.propertyType && "border-red-500 focus-visible:ring-red-500/20"
          )}
        >
          <option value="">Select property type</option>
          {PROPERTY_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormFieldContainer>

      {/* Areas */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer label="Built-up Area (sq ft)" htmlFor="builtup_area" error={errors.builtup_area} showFocusWithin={false}>
          <Input
            id="builtup_area"
            name="builtup_area"
            type="number"
            value={builtup_area as any}
            onChange={(e) => setAndClear("builtup_area", e.target.value)}
            aria-invalid={!!errors.builtup_area}
            className={cx(!!errors.builtup_area && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Carpet Area (sq ft)" htmlFor="carpet_area" error={errors.carpet_area} showFocusWithin={false}>
          <Input
            id="carpet_area"
            name="carpet_area"
            type="number"
            value={carpet_area as any}
            onChange={(e) => setAndClear("carpet_area", e.target.value)}
            aria-invalid={!!errors.carpet_area}
            className={cx(!!errors.carpet_area && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Floor + Furnishing */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer label="Floor" htmlFor="floor" error={errors.floor} showFocusWithin={false}>
          <Input
            id="floor"
            name="floor"
            type="number"
            placeholder="e.g. 4"
            value={floor as any}
            onChange={(e) => setAndClear("floor", e.target.value)}
            aria-invalid={!!errors.floor}
            className={cx(!!errors.floor && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Total Floors" htmlFor="totalFloors" error={errors.totalFloors} showFocusWithin={false}>
          <Input
            id="totalFloors"
            name="totalFloors"
            type="number"
            placeholder="e.g. 10"
            value={totalFloors as any}
            onChange={(e) => setAndClear("totalFloors", e.target.value)}
            aria-invalid={!!errors.totalFloors}
            className={cx(!!errors.totalFloors && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Furnishing" htmlFor="furnishing" error={errors.furnishing} showFocusWithin={false}>
          <select
            id="furnishing"
            name="furnishing"
            value={furnishing}
            onChange={(e) => setAndClear("furnishing", e.target.value)}
            className={cx(
              "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
              !!errors.furnishing && "border-red-500 focus-visible:ring-red-500/20"
            )}
          >
            <option value="">Select</option>
            {FURNISHING.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Washrooms + Pantry + Parking */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer label="Washrooms" htmlFor="washrooms" error={errors.washrooms} showFocusWithin={false}>
          <Input
            id="washrooms"
            name="washrooms"
            type="number"
            value={washrooms as any}
            onChange={(e) => setAndClear("washrooms", e.target.value)}
            aria-invalid={!!errors.washrooms}
            className={cx(!!errors.washrooms && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Pantry" htmlFor="pantry" error={errors.pantry} showFocusWithin={false}>
          <select
            id="pantry"
            name="pantry"
            value={pantry}
            onChange={(e) => setAndClear("pantry", e.target.value)}
            className={cx(
              "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
              !!errors.pantry && "border-red-500 focus-visible:ring-red-500/20"
            )}
          >
            <option value="">Select</option>
            {PANTRY.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormFieldContainer>

        <FormFieldContainer label="Parking Spaces" htmlFor="parkingSpaces" error={errors.parkingSpaces} showFocusWithin={false}>
          <Input
            id="parkingSpaces"
            name="parkingSpaces"
            type="number"
            value={parkingSpaces as any}
            onChange={(e) => setAndClear("parkingSpaces", e.target.value)}
            aria-invalid={!!errors.parkingSpaces}
            className={cx(!!errors.parkingSpaces && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Rent/Deposit/Maint */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer label="Monthly Rent (₹)" htmlFor="rentPrice" error={errors.rentPrice} showFocusWithin={false}>
          <Input
            id="rentPrice"
            name="rentPrice"
            type="number"
            value={rentPrice as any}
            onChange={(e) => setAndClear("rentPrice", e.target.value)}
            aria-invalid={!!errors.rentPrice}
            className={cx(!!errors.rentPrice && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Security Deposit (₹)" htmlFor="deposit" error={errors.deposit} showFocusWithin={false}>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            value={deposit as any}
            onChange={(e) => setAndClear("deposit", e.target.value)}
            aria-invalid={!!errors.deposit}
            className={cx(!!errors.deposit && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Maintenance (₹)" htmlFor="maintenance" error={errors.maintenance} showFocusWithin={false}>
          <Input
            id="maintenance"
            name="maintenance"
            type="number"
            value={maintenance as any}
            onChange={(e) => setAndClear("maintenance", e.target.value)}
            aria-invalid={!!errors.maintenance}
            className={cx(!!errors.maintenance && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Availability / Lease / Power */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer label="Available From" htmlFor="available_from" error={errors.available_from} showFocusWithin={false}>
          <Input
            id="available_from"
            name="available_from"
            type="date"
            value={available_from as any}
            onChange={(e) => setAndClear("available_from", e.target.value)}
            aria-invalid={!!errors.available_from}
            className={cx(!!errors.available_from && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Lease Term (months)" htmlFor="leaseTerm" error={errors.leaseTerm} showFocusWithin={false}>
          <Input
            id="leaseTerm"
            name="leaseTerm"
            type="number"
            value={leaseTerm as any}
            onChange={(e) => setAndClear("leaseTerm", e.target.value)}
            aria-invalid={!!errors.leaseTerm}
            className={cx(!!errors.leaseTerm && "border-red-500 focus-visible:ring-red-500/20")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Power Backup" htmlFor="powerBackup" error={errors.powerBackup} showFocusWithin={false}>
          <select
            id="powerBackup"
            name="powerBackup"
            value={powerBackup}
            onChange={(e) => setAndClear("powerBackup", e.target.value)}
            className={cx(
              "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
              !!errors.powerBackup && "border-red-500 focus-visible:ring-red-500/20"
            )}
          >
            <option value="">Select</option>
            {POWER_BACKUP.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Facilities */}
      <div id="facilities-block">
        <FormFieldContainer
          label="Facilities"
          htmlFor="facilities"
          helperLabel="Select all that apply"
          error={errors.facilities}
          showFocusWithin={false}
        >
          <CheckboxGroupField label="" field="facilities" options={facilitiesOptions} cols={3} />
        </FormFieldContainer>
      </div>

      <button type="submit" className="sr-only" aria-hidden />
    </form>
  );
}
