'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function BabyKidsForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Baby & Kids");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto my-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Baby & Kids Item</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Baby & Kids" required />
        </div>

        {/* Ad Title */}
        <FormField label="Ad Title" field="title" placeholder="e.g., Baby Stroller, Kids Toy, Crib" required />

        {/* Condition */}
        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
          ]}
        />

        {/* Age Range */}
        <SelectField
          label="Suitable Age Range"
          field="ageRange"
          placeholder="Select age range"
          options={[
            { value: "0-6-months", label: "0-6 Months" },
            { value: "6-12-months", label: "6-12 Months" },
            { value: "1-3-years", label: "1-3 Years" },
            { value: "3-5-years", label: "3-5 Years" },
            { value: "5-plus", label: "5+ Years" },
          ]}
        />

        {/* Brand */}
        <FormField label="Brand (optional)" field="brand" placeholder="e.g., Chicco, Fisher-Price" />

        {/* Price */}
        <FormField label="Price (INR)" field="price" type="number" placeholder="Enter price" required />

        {/* Location */}
        <FormField label="Location" field="location" placeholder="City / Area" required />

        {/* Description */}
        <FormField label="Description" field="description" type="textarea" placeholder="Provide details about the item"  required />

        {/* Seller Information */}
        <h3 className="text-xl font-semibold mt-6">Seller Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Name" field="sellerInfo.name" placeholder="Your Name" required />
          <FormField label="Phone Number" field="sellerInfo.phone" placeholder="Enter phone number" required />
        </div>
        <FormField label="Email Address (optional)" field="sellerInfo.email" type="email" placeholder="Enter email" />

      </CardContent>
    </Card>
  );
}
