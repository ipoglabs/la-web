'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function OfficeSuppliesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Office Supplies");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Office Supplies Details</h2>

        {/* Category/Subcategory (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Office Supplies" required />
        </div>

        {/* Basic Details */}
        <FormField
          label="Item Title"
          field="name"
          placeholder="Ex: Office Chair, Printer, Stationery Set"
          required
        />

        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
          ]}
        />

        <SelectField
          label="Type of Supply"
          field="supplyType"
          placeholder="Select type"
          options={[
            { value: "stationery", label: "Stationery" },
            { value: "printer", label: "Printers & Scanners" },
            { value: "furniture", label: "Office Furniture" },
            { value: "storage", label: "Filing & Storage" },
            { value: "other", label: "Other" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Brand/Manufacturer" field="brand" placeholder="Ex: HP, Canon, IKEA" />
          <FormField label="Model/Series" field="model" placeholder="Ex: LaserJet Pro, MALM Desk" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Quantity" field="quantity" type="number" />
          <FormField label="Color/Finish" field="color" placeholder="Ex: Black, White" />
          <FormField label="Material" field="material" placeholder="Ex: Wood, Plastic, Metal" />
        </div>

        <FormField
          label="Features/Specifications"
          field="features"
          type="textarea"
          placeholder="Ex: Adjustable height, Wireless, Ergonomic design"
        />

        <FormField label="Price (₹)" field="salePrice" type="number" placeholder="Ex: 499" />

        <SelectField
          label="Negotiable"
          field="negotiable"
          placeholder="Select"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
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

        <FormField
          label="Business / Individual"
          field="businessType"
          placeholder="Ex: Individual, Company"
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide detailed description..."
        />
      </CardContent>
    </Card>
  );
}
