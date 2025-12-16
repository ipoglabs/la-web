"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { cn as cx } from "@/lib/utils";
import { toast } from "sonner";
import { usePostFormStore } from "@/app/post/store/postFormStore";

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
  { value: "full", label: "Full", },
];

export default function CommercialForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const setField = usePostFormStore((s) => s.setField);

  // --- store values ---
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

  const facilities = (usePostFormStore((s) => (s as any).facilities) as string[]) ?? [];

  const sellerInfo =
    usePostFormStore((s) => (s as any).sellerInfo) ?? { name: "", email: "", phone: "" };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const facilitiesOptions = useMemo(
    () => ["Parking", "Lift", "Power Backup", "Security/CCTV", "Fire Safety", "Visitor Parking"],
    []
  );

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

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // let parent page know validation status
  const dispatchValidated = (ok: boolean) => {
    // generic + specific (so your parent can listen to either)
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("commercialform:validated", { detail: { ok } }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    // required basics (match your addPost server validation)
    if (!String(name).trim()) mapped.name = "Listing title is required.";
    if (!String(description).trim()) mapped.description = "Description is required.";

    // commercial minimums (you can relax if you want)
    if (!propertyType) mapped.propertyType = "Please select property type.";
    if (!isPositive(rentPrice)) mapped.rentPrice = "Monthly rent must be greater than 0.";

    // numbers (only validate if user typed something)
    if (String(builtup_area).trim() && !isPositive(builtup_area))
      mapped.builtup_area = "Built-up area must be a positive number.";

    if (String(carpet_area).trim() && !isPositive(carpet_area))
      mapped.carpet_area = "Carpet area must be a positive number.";

    if (String(floor).trim() && !isNonNegative(floor)) mapped.floor = "Floor must be 0 or more.";
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

    // contact validation (server requires name/email/phone)
    if (!String(sellerInfo?.name ?? "").trim()) mapped.contactName = "Contact name is required.";
    if (!String(sellerInfo?.email ?? "").trim()) mapped.contactEmail = "Contact email is required.";
    else if (!isEmail(String(sellerInfo.email))) mapped.contactEmail = "Enter a valid email.";
    if (!String(sellerInfo?.phone ?? "").trim()) mapped.contactPhone = "Contact phone is required.";

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
      id="commercialForm"
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
          onChange={(e) => setField("name", e.target.value)}
          className={cx(!!errors.name && "border-red-500 focus-visible:ring-red-500/20")}
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
          placeholder="Describe the space, highlights, connectivity, etc."
          value={description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          className={cx(!!errors.description && "border-red-500 focus-visible:ring-red-500/20")}
        />
      </FormFieldContainer>

      {/* Property type */}
      <FormFieldContainer
        label="Property Type"
        htmlFor="propertyType"
        error={errors.propertyType}
        showFocusWithin={false}
      >
        <select
          id="propertyType"
          name="propertyType"
          value={propertyType}
          onChange={(e) => setField("propertyType", e.target.value)}
          className={cx(
            "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
            !!errors.propertyType && "border-red-500"
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
            onChange={(e) => setField("floor", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Total Floors"
          htmlFor="totalFloors"
          error={errors.totalFloors}
          showFocusWithin={false}
        >
          <Input
            id="totalFloors"
            name="totalFloors"
            type="number"
            placeholder="e.g. 10"
            value={totalFloors as any}
            onChange={(e) => setField("totalFloors", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Furnishing" htmlFor="furnishing" error={errors.furnishing} showFocusWithin={false}>
          <select
            id="furnishing"
            name="furnishing"
            value={furnishing}
            onChange={(e) => setField("furnishing", e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
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
        <FormFieldContainer
          label="Washrooms"
          htmlFor="washrooms"
          error={errors.washrooms}
          showFocusWithin={false}
        >
          <Input
            id="washrooms"
            name="washrooms"
            type="number"
            value={washrooms as any}
            onChange={(e) => setField("washrooms", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Pantry" htmlFor="pantry" error={errors.pantry} showFocusWithin={false}>
          <select
            id="pantry"
            name="pantry"
            value={pantry}
            onChange={(e) => setField("pantry", e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select</option>
            {PANTRY.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormFieldContainer>

        <FormFieldContainer
          label="Parking Spaces"
          htmlFor="parkingSpaces"
          error={errors.parkingSpaces}
          showFocusWithin={false}
        >
          <Input
            id="parkingSpaces"
            name="parkingSpaces"
            type="number"
            value={parkingSpaces as any}
            onChange={(e) => setField("parkingSpaces", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Rent/Deposit/Maint */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer
          label="Monthly Rent (₹)"
          htmlFor="rentPrice"
          error={errors.rentPrice}
          showFocusWithin={false}
        >
          <Input
            id="rentPrice"
            name="rentPrice"
            type="number"
            value={rentPrice as any}
            onChange={(e) => setField("rentPrice", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Security Deposit (₹)" htmlFor="deposit" error={errors.deposit} showFocusWithin={false}>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            value={deposit as any}
            onChange={(e) => setField("deposit", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Maintenance (₹)"
          htmlFor="maintenance"
          error={errors.maintenance}
          showFocusWithin={false}
        >
          <Input
            id="maintenance"
            name="maintenance"
            type="number"
            value={maintenance as any}
            onChange={(e) => setField("maintenance", e.target.value)}
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
            onChange={(e) => setField("available_from", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Lease Term (months)" htmlFor="leaseTerm" error={errors.leaseTerm} showFocusWithin={false}>
          <Input
            id="leaseTerm"
            name="leaseTerm"
            type="number"
            value={leaseTerm as any}
            onChange={(e) => setField("leaseTerm", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Power Backup" htmlFor="powerBackup" error={errors.powerBackup} showFocusWithin={false}>
          <select
            id="powerBackup"
            name="powerBackup"
            value={powerBackup}
            onChange={(e) => setField("powerBackup", e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
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
      <FormFieldContainer label="Facilities" htmlFor="facilities" helperLabel="Select all that apply" showFocusWithin={false}>
        <CheckboxGroupField label="" field="facilities" options={facilitiesOptions} cols={3} />
      </FormFieldContainer>

      {/* Contact Info */}
      {/* <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer label="Contact Name" htmlFor="contactName" error={errors.contactName} showFocusWithin={false}>
          <Input
            id="contactName"
            placeholder="Owner/Manager Name"
            value={sellerInfo?.name ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
            className={cx(!!errors.contactName && "border-red-500")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Email" htmlFor="contactEmail" error={errors.contactEmail} showFocusWithin={false}>
          <Input
            id="contactEmail"
            type="email"
            placeholder="Email address"
            value={sellerInfo?.email ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
            className={cx(!!errors.contactEmail && "border-red-500")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Phone" htmlFor="contactPhone" error={errors.contactPhone} showFocusWithin={false}>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="Phone number"
            value={sellerInfo?.phone ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
            className={cx(!!errors.contactPhone && "border-red-500")}
          />
        </FormFieldContainer>
      </FormFieldWrapper> */}

      {/* Hidden submit so requestSubmit works */}
      <button type="submit" className="sr-only" aria-hidden />
    </form>
  );
}