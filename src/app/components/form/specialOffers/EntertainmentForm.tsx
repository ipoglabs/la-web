"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function EntertainmentForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const organizerName = store.organizerName ?? "";
  const eventType = store.eventType ?? "";
  const eventDate = store.eventDate ?? "";
  const startTime = store.startTime ?? "";
  const endTime = store.endTime ?? "";
  const ageRestriction = store.ageRestriction ?? "";
  const website = store.website ?? "";
  const socialMedia = store.socialMedia ?? "";
  const description = store.description ?? "";
  const price = store.salePrice ?? store.price ?? "";
  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Community & Events");
    if (!subcategory) setField("subcategory", "Entertainment");
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
    setField("salePrice", v);
    setField("price", v);
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

    if (!name.trim()) mapped.name = "Event title required";
    if (!eventDate) mapped.eventDate = "Event date required";
    if (price && !isPositive(price))
      mapped.salePrice = "Invalid ticket price";
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

    // Clean persist
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
      <h2 className="text-2xl font-bold">Entertainment Event</h2>

      {/* Event Title */}
      <FormField
        label="Event / Entertainment Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Organizer */}
      <FormField
        label="Organizer / Company Name"
        field="organizerName"
        value={organizerName}
        onChange={(v) => setField("organizerName", v)}
      />

      <ToggleButtonGroup title="Event Type" singleSelect value={eventType ? [eventType] : []} onChange={(v) => setField("eventType", v[0] ?? "")}>
        <ToggleGroupButton value="concert">Concert</ToggleGroupButton>
        <ToggleGroupButton value="movie">Movie / Premiere</ToggleGroupButton>
        <ToggleGroupButton value="theater">Theater / Play</ToggleGroupButton>
        <ToggleGroupButton value="festival">Festival</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Event Date"
          field="eventDate"
          type="date"
          value={eventDate}
          onChange={(v) => setField("eventDate", v)}
        />
        <FormField
          label="Start Time"
          field="startTime"
          type="time"
          value={startTime}
          onChange={(v) => setField("startTime", v)}
        />
        <FormField
          label="End Time"
          field="endTime"
          type="time"
          value={endTime}
          onChange={(v) => setField("endTime", v)}
        />
      </div>

      {/* Location */}
      <FormField
        label="Location"
        field="sellerLocation"
        value={location?.address ?? ""}
        onChange={(v) => setLoc((v as string) || "")}
      />

      {/* Ticket Price */}
      <FormField
        label={`Ticket Price / Entry Fee (${currency})`}
        field="salePrice"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
      />

      <ToggleButtonGroup title="Age Restriction" singleSelect value={ageRestriction ? [ageRestriction] : []} onChange={(v) => setField("ageRestriction", v[0] ?? "")}>
        <ToggleGroupButton value="all">All Ages</ToggleGroupButton>
        <ToggleGroupButton value="13+">13+</ToggleGroupButton>
        <ToggleGroupButton value="18+">18+</ToggleGroupButton>
        <ToggleGroupButton value="21+">21+</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Website */}
      <FormField
        label="Event Website"
        field="website"
        type="url"
        value={website}
        onChange={(v) => setField("website", v)}
      />

      {/* Social Media */}
      <FormField
        label="Social Media Link"
        field="socialMedia"
        type="url"
        value={socialMedia}
        onChange={(v) => setField("socialMedia", v)}
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Contact */}
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