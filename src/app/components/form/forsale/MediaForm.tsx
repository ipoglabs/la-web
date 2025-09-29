"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function BooksMusicMediaForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory (For Sale → Books & Media)
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Books & Media");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested objects
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  // Images
  const onImagesChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files ?? []);
    setField("images", [...(store.images ?? []), ...files]);
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Books · Music · Media</h2>

        {/* Category/Subcategory (bound to shared store) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Books & Media" required />
        </div>

        {/* Basic */}
        <FormField
          label="Title"
          field="name"
          placeholder="e.g., Harry Potter, The Beatles – Abbey Road, PS4 Game"
          required
        />

        <SelectField
          label="Item Type"
          field="mediaType"
          placeholder="Select type"
          options={[
            { value: "book", label: "Book" },
            { value: "music", label: "Music (CD/Vinyl/Digital)" },
            { value: "movie", label: "Movie / DVD / Blu-ray" },
            { value: "game", label: "Game" },
            { value: "other", label: "Other Media" },
          ]}
        />

        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
            { value: "collectible", label: "Collectible" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Author / Artist"
            field="authorArtist"
            placeholder="e.g., J.K. Rowling / The Beatles"
          />
          <FormField
            label="Genre"
            field="genre"
            placeholder="e.g., Fiction, Rock, Action"
          />
        </div>

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Add details like edition, year, publisher/label, region, special features…"
        />

        {/* Pricing */}
        <FormField
          label="Price (₹)"
          field="salePrice"            // map price → salePrice for consistency
          type="number"
          inputMode="decimal"
          placeholder="e.g., 499"
          min={0}
          hint="Use whole numbers; you can mark negotiable in the next field."
        />

        <SelectField
          label="Negotiable"
          field="negotiable"
          placeholder="Select"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />

        {/* Location (store.location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City / Area"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
          required
        />

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="you@example.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="+91 9876543210"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>

      </CardContent>
    </Card>
  );
}
