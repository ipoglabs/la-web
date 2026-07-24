"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function HolidayOffersForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const providerName = (store as any).providerName ?? "";
  const holidayCategory = (store as any).holidayCategory ?? "";
  const startDate = (store as any).startDate ?? "";
  const endDate = (store as any).endDate ?? "";
  const location = store.location ?? {};
  const price = (store as any).price ?? (store as any).salePrice ?? "";
  const discount = (store as any).discount ?? "";
  const couponCode = (store as any).couponCode ?? "";
  const bookingLink = (store as any).bookingLink ?? "";
  const maxParticipants = (store as any).maxParticipants ?? "";
  const audience = (store as any).audience ?? "";
  const mediaUrl = (store as any).mediaUrl ?? "";
  const description = store.description ?? "";
  const terms = (store as any).terms ?? "";
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) setField("category", "Special Offers");
    if (!subcategory) setField("subcategory", "Holiday");
  }, [category, subcategory, setField]);

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el =
      formRef.current?.querySelector<HTMLElement>(
        `[name="${first}"]`
      );

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLoc = (address?: string) => {
    const cur = location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Offer title required";
    if (price && !isPositive(price))
      mapped.price = "Invalid price";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">Holiday & Seasonal Offers</h2>

      <FormField
        label="Offer Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Provider / Company Name"
        field="providerName"
        value={providerName}
        onChange={(v) => setField("providerName", v)}
      />

      <ToggleButtonGroup title="Category" singleSelect value={holidayCategory ? [holidayCategory] : []} onChange={(v) => setField("holidayCategory", v[0] ?? "")}>
        <ToggleGroupButton value="holiday-packages">Holiday Packages</ToggleGroupButton>
        <ToggleGroupButton value="seasonal-sale">Seasonal Sale</ToggleGroupButton>
        <ToggleGroupButton value="special-offers">Special Offers</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          field="startDate"
          type="date"
          value={startDate}
          onChange={(v) => setField("startDate", v)}
        />
        <FormField
          label="End Date"
          field="endDate"
          type="date"
          value={endDate}
          onChange={(v) => setField("endDate", v)}
        />
      </div>

      <FormField
        label="Location"
        field="sellerLocation"
        value={location?.address ?? ""}
        onChange={(v) => setLoc((v as string) || "")}
      />

      <FormField
        label="Price / Cost"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
      />

      <FormField
        label="Discount / Deal"
        field="discount"
        value={discount}
        onChange={(v) => setField("discount", v)}
      />

      <FormField
        label="Coupon Code"
        field="couponCode"
        value={couponCode}
        onChange={(v) => setField("couponCode", v)}
      />

      <FormField
        label="Booking Link"
        field="bookingLink"
        type="url"
        value={bookingLink}
        onChange={(v) => setField("bookingLink", v)}
      />

      <FormField
        label="Max Participants"
        field="maxParticipants"
        type="number"
        value={maxParticipants}
        onChange={(v) => setField("maxParticipants", v)}
      />

      <FormField
        label="Target Audience"
        field="audience"
        value={audience}
        onChange={(v) => setField("audience", v)}
      />

      <FormField
        label="Media URL"
        field="mediaUrl"
        type="url"
        value={mediaUrl}
        onChange={(v) => setField("mediaUrl", v)}
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <FormField
        label="Terms & Conditions"
        field="terms"
        type="textarea"
        value={terms}
        onChange={(v) => setField("terms", v)}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Contact Name"
          field="sellerName"
          value={sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", (v as string) || "")}
          required
        />
        <FormField
          label="Contact Email"
          field="sellerEmail"
          type="email"
          value={sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", (v as string) || "")}
        />
        <FormField
          label="Contact Phone"
          field="sellerPhone"
          type="tel"
          value={sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", (v as string) || "")}
          required
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}