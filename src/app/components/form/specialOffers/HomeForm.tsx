"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HomeLivingForm() {
  const { formData, updateFormData } = usePostFormStore();

  // Set default category & subcategory
  useEffect(() => {
    if (!formData.category) updateFormData("category", "For Sale");
    if (!formData.subcategory) updateFormData("subcategory", "Home & Living");
  }, [formData, updateFormData]);

  // Handle nested seller info
  const handleSellerInfoChange = (field: string, value: string) => {
    updateFormData("sellerInfo", {
      ...formData.sellerInfo,
      [field]: value,
    });
  };

  // Handle nested location
  const handleLocationChange = (field: string, value: string) => {
    updateFormData("location", {
      ...formData.location,
      [field]: value,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Home & Living</h2>

        <div className="space-y-4">
          {/* Category (readonly) */}
          <FormField label="Category" field="category" value="For Sale" disabled />

          {/* Subcategory (readonly) */}
          <FormField label="Subcategory" field="subcategory" value="Home & Living" disabled />

          {/* Item Name */}
          <FormField label="Item Name" field="itemName" placeholder="e.g. Sofa, Dining Table, Lamp" />

          {/* Brand Name */}
          <FormField label="Brand Name" field="brandName" placeholder="Brand or Manufacturer" />

          {/* Category Type */}
          <SelectField
            label="Category Type"
            field="categoryType"
            options={[
              { value: "furniture", label: "Furniture" },
              { value: "home-decor", label: "Home Decor" },
              { value: "appliances", label: "Appliances" },
              { value: "kitchenware", label: "Kitchenware" },
              { value: "other", label: "Other" },
            ]}
          />

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

          <FormField label="Material" field="material" placeholder="e.g. Wood, Metal, Fabric" />
          <FormField label="Dimensions (L x W x H)" field="dimensions" placeholder="e.g. 6ft x 3ft x 2.5ft" />
          <FormField label="Color" field="color" placeholder="e.g. Black, Beige, Oak" />
          <FormField label="Weight" field="weight" placeholder="e.g. 25kg" />
          <FormField label="Warranty" field="warranty" placeholder="e.g. 1 Year" />
          <FormField label="Usage Duration (if used)" field="usageDuration" placeholder="e.g. 6 months, 2 years" />
          <FormField label="Price" field="price" placeholder="e.g. ₹15,000" />

          {/* Delivery Option */}
          <SelectField
            label="Delivery / Pickup Option"
            field="deliveryOption"
            options={[
              { value: "pickup", label: "Pickup Only" },
              { value: "delivery", label: "Home Delivery Available" },
              { value: "both", label: "Pickup & Delivery" },
            ]}
          />

          {/* Media */}
          <FormField label="Image / Media URL" field="mediaUrl" placeholder="https://example.com/item-image.jpg" />

          {/* Description */}
          <FormField label="Description" field="description" placeholder="Provide details about the item" type="textarea" />

          {/* Location */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Location</h3>
          <FormField
            label="City"
            field="location.city"
            value={formData.location?.city || ""}
            onChange={(val) => handleLocationChange("city", val as string)}
            placeholder="Enter City"
          />
          <FormField
            label="State"
            field="location.state"
            value={formData.location?.state || ""}
            onChange={(val) => handleLocationChange("state", val as string)}
            placeholder="Enter State"
          />
          <FormField
            label="Zipcode"
            field="location.zipcode"
            value={formData.location?.zipcode || ""}
            onChange={(val) => handleLocationChange("zipcode", val as string)}
            placeholder="Enter Zipcode"
          />

          {/* Seller Info */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Seller Information</h3>
          <FormField
            label="Name"
            field="sellerInfo.name"
            value={formData.sellerInfo?.name || ""}
            onChange={(val) => handleSellerInfoChange("name", val as string)}
            placeholder="Contact Person"
          />
          <FormField
            label="Email"
            field="sellerInfo.email"
            type="email"
            value={formData.sellerInfo?.email || ""}
            onChange={(val) => handleSellerInfoChange("email", val as string)}
            placeholder="Email Address"
          />
          <FormField
            label="Phone"
            field="sellerInfo.phone"
            type="tel"
            value={formData.sellerInfo?.phone || ""}
            onChange={(val) => handleSellerInfoChange("phone", val as string)}
            placeholder="Phone Number"
          />
        </div>
      </CardContent>
    </Card>
  );
}
