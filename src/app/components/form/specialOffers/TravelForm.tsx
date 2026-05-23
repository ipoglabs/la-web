"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function TravelTourismForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const tourTitle = store.tourTitle ?? "";
  const tourType = store.tourType ?? "";
  const description = store.description ?? "";
  const startDate = store.startDate ?? "";
  const endDate = store.endDate ?? "";
  const duration = store.duration ?? "";
  const itinerary = store.itinerary ?? "";
  const inclusions = store.inclusions ?? "";
  const exclusions = store.exclusions ?? "";
  const accommodation = store.accommodation ?? "";
  const transport = store.transport ?? "";
  const groupSize = store.groupSize ?? "";
  const bookingDeadline = store.bookingDeadline ?? "";
  const price = store.price ?? store.salePrice ?? "";
  const specialOffers = store.specialOffers ?? "";
  const cancellationPolicy = store.cancellationPolicy ?? "";
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory) setField("subcategory", "Travel & Tourism");
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
    setField("sellerInfo", { ...sellerInfo, [k]: v ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!tourTitle.trim()) mapped.tourTitle = "Tour title required";
    if (!tourType) mapped.tourType = "Tour type required";
    if (!isPositive(price)) mapped.price = "Invalid price";
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

    setField("tourTitle", tourTitle.trim());
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
      <h2 className="text-2xl font-bold">Travel & Tourism</h2>

      <FormField
        label="Tour / Package Title"
        field="tourTitle"
        value={tourTitle}
        onChange={(v) => setField("tourTitle", v)}
        required
      />

      <ToggleButtonGroup title="Tour Type" singleSelect value={tourType ? [tourType] : []} onChange={(v) => setField("tourType", v[0] ?? "")}>
        <ToggleGroupButton value="domestic">Domestic</ToggleGroupButton>
        <ToggleGroupButton value="international">International</ToggleGroupButton>
        <ToggleGroupButton value="adventure">Adventure</ToggleGroupButton>
        <ToggleGroupButton value="cruise">Cruise</ToggleGroupButton>
        <ToggleGroupButton value="honeymoon">Honeymoon</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" field="startDate" type="date" value={startDate} onChange={(v) => setField("startDate", v)} />
        <FormField label="End Date" field="endDate" type="date" value={endDate} onChange={(v) => setField("endDate", v)} />
      </div>

      <FormField label="Duration" field="duration" value={duration} onChange={(v) => setField("duration", v)} />
      <FormField label="Itinerary / Highlights" field="itinerary" type="textarea" value={itinerary} onChange={(v) => setField("itinerary", v)} />
      <FormField label="Inclusions" field="inclusions" type="textarea" value={inclusions} onChange={(v) => setField("inclusions", v)} />
      <FormField label="Exclusions" field="exclusions" type="textarea" value={exclusions} onChange={(v) => setField("exclusions", v)} />

      <ToggleButtonGroup title="Accommodation Type" singleSelect value={accommodation ? [accommodation] : []} onChange={(v) => setField("accommodation", v[0] ?? "")}>
        <ToggleGroupButton value="hotel">Hotel</ToggleGroupButton>
        <ToggleGroupButton value="resort">Resort</ToggleGroupButton>
        <ToggleGroupButton value="hostel">Hostel</ToggleGroupButton>
        <ToggleGroupButton value="camp">Camp</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Transport Mode" singleSelect value={transport ? [transport] : []} onChange={(v) => setField("transport", v[0] ?? "")}>
        <ToggleGroupButton value="flight">Flight</ToggleGroupButton>
        <ToggleGroupButton value="train">Train</ToggleGroupButton>
        <ToggleGroupButton value="bus">Bus</ToggleGroupButton>
        <ToggleGroupButton value="cruise">Cruise</ToggleGroupButton>
        <ToggleGroupButton value="own">Own Transport</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Group Size" field="groupSize" value={groupSize} onChange={(v) => setField("groupSize", v)} />
      <FormField label="Booking Deadline" field="bookingDeadline" type="date" value={bookingDeadline} onChange={(v) => setField("bookingDeadline", v)} />

      <FormField
        label="Price"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <FormField label="Special Offers" field="specialOffers" value={specialOffers} onChange={(v) => setField("specialOffers", v)} />
      <FormField label="Cancellation Policy" field="cancellationPolicy" type="textarea" value={cancellationPolicy} onChange={(v) => setField("cancellationPolicy", v)} />

      {/* <h3 className="text-lg font-semibold">Seller Information</h3>

      <FormField
        label="Contact Name"
        field="sellerName"
        value={sellerInfo?.name ?? ""}
        onChange={(v) => setSeller("name", v as string)}
        required
      />

      <FormField
        label="Contact Email"
        field="sellerEmail"
        type="email"
        value={sellerInfo?.email ?? ""}
        onChange={(v) => setSeller("email", v as string)}
      />

      <FormField
        label="Contact Phone"
        field="sellerPhone"
        type="tel"
        value={sellerInfo?.phone ?? ""}
        onChange={(v) => setSeller("phone", v as string)}
        required
      /> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}