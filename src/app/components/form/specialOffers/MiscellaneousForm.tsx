"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function MiscellaneousForm() {
  const { formData, updateFormData } = usePostFormStore();

  // Set default category & subcategory
  useEffect(() => {
    if (!formData.category) updateFormData("category", "For Sale");
    if (!formData.subcategory) updateFormData("subcategory", "Miscellaneous");
  }, [formData, updateFormData]);

  // Helpers for nested objects (only needed when you want custom logic)
  const handleSellerInfoChange = (key: string, value?: string | number) => {
    updateFormData("sellerInfo", { ...formData.sellerInfo, [key]: value ?? "" });
  };
  const handleLocationChange = (key: string, value?: string | number) => {
    updateFormData("location", { ...formData.location, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Miscellaneous</h2>

        <div className="space-y-4">
          {/* Category (readonly) */}
          <FormField label="Category" field="category" value="For Sale" disabled />

          {/* Subcategory (readonly) */}
          <FormField label="Subcategory" field="subcategory" value="Miscellaneous" disabled />

          {/* Title -> store as "name" for backend consistency */}
          <FormField label="Title" field="name" placeholder="Listing Title" required />

          {/* Condition */}
          <SelectField
            label="Condition"
            field="condition"
            options={[
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
              { value: "refurbished", label: "Refurbished" },
            ]}
          />

          {/* Brand / Model / Usage / Age */}
          <FormField label="Brand (if applicable)" field="brand" placeholder="e.g. Philips, Sony" />
          <FormField label="Model" field="model" placeholder="Model name or number" />
          <FormField label="Usage Duration (if used)" field="usageDuration" placeholder="e.g. 6 months, 2 years" />
          <FormField label="Age of Item" field="age" placeholder="e.g. 1 year old" />

          {/* Exchange Option */}
          <SelectField
            label="Exchange/Trade Option"
            field="exchangeOption"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />

          {/* Price */}
          <FormField label="Price" field="price" type="number" placeholder="e.g. ₹5,000" />

          {/* Delivery Option */}
          <SelectField
            label="Delivery / Pickup Option"
            field="deliveryOption"
            options={[
              { value: "pickup", label: "Pickup Only" },
              { value: "delivery", label: "Delivery Available" },
              { value: "both", label: "Pickup & Delivery" },
            ]}
          />

          {/* Media URL (optional) */}
          <FormField label="Image / Media URL" field="mediaUrl" placeholder="https://example.com/item-image.jpg" />

          {/* Description */}
          <FormField
            label="Description"
            field="description"
            type="textarea"
            placeholder="Provide details about the item or service"
            required
          />

          {/* Location */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Location</h3>
          <FormField
            label="City"
            field="location.city"
            value={formData.location?.city ?? ""}
            onChange={(val) => handleLocationChange("city", val as string)}
            placeholder="Enter City"
          />
          <FormField
            label="State"
            field="location.state"
            value={formData.location?.state ?? ""}
            onChange={(val) => handleLocationChange("state", val as string)}
            placeholder="Enter State"
          />
          <FormField
            label="Zipcode"
            field="location.zipcode"
            value={formData.location?.zipcode ?? ""}
            onChange={(val) => handleLocationChange("zipcode", val as string)}
            placeholder="Enter Zipcode"
          />

          {/* Seller Info */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Seller Information</h3>
          <FormField
            label="Name"
            field="sellerInfo.name"
            value={formData.sellerInfo?.name ?? ""}
            onChange={(val) => handleSellerInfoChange("name", val as string)}
            placeholder="Contact Person"
            required
          />
          <FormField
            label="Email"
            field="sellerInfo.email"
            type="email"
            value={formData.sellerInfo?.email ?? ""}
            onChange={(val) => handleSellerInfoChange("email", val as string)}
            placeholder="Email Address"
            required
          />
          <FormField
            label="Phone"
            field="sellerInfo.phone"
            type="tel"
            value={formData.sellerInfo?.phone ?? ""}
            onChange={(val) => handleSellerInfoChange("phone", val as string)}
            placeholder="Phone Number"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
