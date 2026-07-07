"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function FoodDiningForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const foodCategory = store.foodCategory ?? "";
  const description = store.description ?? "";
  const priceRange = store.priceRange ?? "";
  const cuisineType = store.cuisineType ?? "";
  const openingHours = store.openingHours ?? "";
  const deliveryOption = store.deliveryOption ?? "";
  const website = store.website ?? "";
  const menuLink = store.menuLink ?? "";
  const averageRating = store.averageRating ?? "";
  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Community & Events");
    if (!subcategory) setField("subcategory", "Food & Dining");
  }, [category, subcategory, setField]);

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

    if (!name.trim()) mapped.name = "Service / restaurant name required";
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
      <h2 className="text-2xl font-bold">Food & Dining Service</h2>

      {/* Service Name */}
      <FormField
        label="Service / Restaurant Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <ToggleButtonGroup title="Category" singleSelect value={foodCategory ? [foodCategory] : []} onChange={(v) => setField("foodCategory", v[0] ?? "")}>
        <ToggleGroupButton value="restaurant">Restaurant</ToggleGroupButton>
        <ToggleGroupButton value="cafe">Cafe</ToggleGroupButton>
        <ToggleGroupButton value="delivery">Food Delivery</ToggleGroupButton>
        <ToggleGroupButton value="catering">Catering</ToggleGroupButton>
        <ToggleGroupButton value="streetfood">Street Food</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Location */}
      <FormField
        label="Location"
        field="sellerLocation"
        value={location?.address ?? ""}
        onChange={(v) => setLoc((v as string) || "")}
      />

      {/* Price Range */}
      <FormField
        label="Price Range"
        field="priceRange"
        value={priceRange}
        onChange={(v) => setField("priceRange", v)}
      />

      {/* Cuisine */}
      <FormField
        label="Cuisine Type"
        field="cuisineType"
        value={cuisineType}
        onChange={(v) => setField("cuisineType", v)}
      />

      {/* Opening Hours */}
      <FormField
        label="Opening Hours"
        field="openingHours"
        value={openingHours}
        onChange={(v) => setField("openingHours", v)}
      />

      <ToggleButtonGroup title="Delivery Option" singleSelect value={deliveryOption ? [deliveryOption] : []} onChange={(v) => setField("deliveryOption", v[0] ?? "")}>
        <ToggleGroupButton value="yes">Yes</ToggleGroupButton>
        <ToggleGroupButton value="no">No</ToggleGroupButton>
        <ToggleGroupButton value="thirdparty">Via Swiggy / Zomato</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Website */}
      <FormField
        label="Website"
        field="website"
        type="url"
        value={website}
        onChange={(v) => setField("website", v)}
      />

      {/* Menu Link */}
      <FormField
        label="Menu Link"
        field="menuLink"
        type="url"
        value={menuLink}
        onChange={(v) => setField("menuLink", v)}
      />

      {/* Rating */}
      <FormField
        label="Average Rating"
        field="averageRating"
        type="number"
        value={averageRating}
        onChange={(v) => setField("averageRating", v)}
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