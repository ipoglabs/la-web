'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function SportsFitnessForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory defaults
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Sports & Fitness");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Sports & Fitness Item Details</h2>

        {/* Category/Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Sports & Fitness" required />
        </div>

        {/* Basic Details */}
        <FormField
          label="Ad Title"
          field="name"
          placeholder="Ex: Treadmill, Cricket Bat"
          required
        />

        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select Condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
          ]}
        />

        <FormField label="Brand" field="brand" placeholder="Ex: Yonex, Adidas, Decathlon" />
        <FormField label="Type" field="type" placeholder="Ex: Dumbbells, Football, Yoga Mat" />

        <FormField
          label="Price (₹)"
          field="salePrice"
          type="number"
          placeholder="Ex: 499"
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe the item in detail"
        />

        {/* Seller Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Seller Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setField("sellerInfo", { ...store.sellerInfo, name: v as string })
            }
            placeholder="Your name"
          />
          <FormField
            label="Contact"
            field="__ignore_seller_contact__"
            value={store.sellerInfo?.phone ?? store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setField("sellerInfo", { ...store.sellerInfo, phone: v as string })
            }
            placeholder="Phone or Email"
          />
        </div>
      </CardContent>
    </Card>
  );
}
