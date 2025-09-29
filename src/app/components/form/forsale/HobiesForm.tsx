'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HobbiesCollectionsForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Hobbies & Collections");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Hobbies & Collections Item</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Hobbies & Collections" required />
        </div>

        {/* Item Type */}
        <SelectField
          label="Item Type"
          field="itemType"
          placeholder="Select item type"
          options={[
            { value: "art", label: "Art" },
            { value: "antiques", label: "Antiques" },
            { value: "books", label: "Books & Comics" },
            { value: "musical", label: "Musical Instruments" },
            { value: "stamps", label: "Stamps & Coins" },
            { value: "sports", label: "Sports Memorabilia" },
            { value: "other", label: "Other Collectibles" },
          ]}
        />

        {/* Condition */}
        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
            { value: "vintage", label: "Vintage" },
          ]}
        />

        {/* Price & Negotiable */}
        <FormField label="Price (INR)" field="price" type="number" placeholder="Enter price" required />
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={store.negotiable ?? false}
            onChange={(e) => setField("negotiable", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Negotiable</span>
        </div>

        {/* Description */}
        <FormField label="Description" field="description" type="textarea" placeholder="Describe your item in detail"  required />


        {/* Seller Information */}
        <h3 className="text-xl font-semibold mt-6">Seller Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Name" field="sellerInfo.name" placeholder="Your full name" required />
          <FormField label="Phone Number" field="sellerInfo.phone" placeholder="Enter phone number" required />
        </div>
        <FormField label="Email Address" field="sellerInfo.email" type="email" placeholder="Enter your email" required />
      </CardContent>
    </Card>
  );
}
