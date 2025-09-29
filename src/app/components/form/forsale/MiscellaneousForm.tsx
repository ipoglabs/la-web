'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function MiscellaneousForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Miscellaneous");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Miscellaneous Item Details</h2>

        {/* Category/Subcategory (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Miscellaneous" required />
        </div>

        {/* Basic Fields */}
        <FormField
          label="Item Title"
          field="name"
          placeholder="Enter item title"
          required
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe the item in detail"
        />

        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
            { value: "for-parts", label: "For Parts" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Price (₹)"
          field="salePrice"
          type="number"
          placeholder="Enter price"
          min={0}
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

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setField("sellerInfo", { ...store.sellerInfo, name: v as string })
            }
            placeholder="Your name"
            required
          />
          <FormField
            label="Contact"
            field="__ignore_seller_contact__"
            value={store.sellerInfo?.phone ?? store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setField("sellerInfo", { ...store.sellerInfo, phone: v as string })
            }
            placeholder="Phone or Email"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
