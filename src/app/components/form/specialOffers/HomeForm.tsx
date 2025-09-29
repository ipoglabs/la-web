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
    if (!formData.category) {
      updateFormData("category", "For Sale");
    }
    if (!formData.subcategory) {
      updateFormData("subcategory", "Home & Living");
    }
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
          <FormField
            label="Category"
            name="category"
            value="For Sale"
            disabled
          />

          {/* Subcategory (readonly) */}
          <FormField
            label="Subcategory"
            name="subcategory"
            value="Home & Living"
            disabled
          />

          {/* Item Name */}
          <FormField
            label="Item Name"
            name="itemName"
            placeholder="e.g. Sofa, Dining Table, Lamp"
          />

          {/* Brand Name */}
          <FormField
            label="Brand Name"
            name="brandName"
            placeholder="Brand or Manufacturer"
          />

          {/* Category Type */}
          <SelectField
            label="Category Type"
            name="categoryType"
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
            name="condition"
            options={[
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
              { value: "refurbished", label: "Refurbished" },
            ]}
          />

          {/* Material */}
          <FormField
            label="Material"
            name="material"
            placeholder="e.g. Wood, Metal, Fabric"
          />

          {/* Dimensions */}
          <FormField
            label="Dimensions (L x W x H)"
            name="dimensions"
            placeholder="e.g. 6ft x 3ft x 2.5ft"
          />

          {/* Color */}
          <FormField
            label="Color"
            name="color"
            placeholder="e.g. Black, Beige, Oak"
          />

          {/* Weight */}
          <FormField
            label="Weight"
            name="weight"
            placeholder="e.g. 25kg"
          />

          {/* Warranty */}
          <FormField
            label="Warranty"
            name="warranty"
            placeholder="e.g. 1 Year"
          />

          {/* Usage Duration */}
          <FormField
            label="Usage Duration (if used)"
            name="usageDuration"
            placeholder="e.g. 6 months, 2 years"
          />

          {/* Price */}
          <FormField
            label="Price"
            name="price"
            placeholder="e.g. ₹15,000"
          />

          {/* Delivery Option */}
          <SelectField
            label="Delivery / Pickup Option"
            name="deliveryOption"
            options={[
              { value: "pickup", label: "Pickup Only" },
              { value: "delivery", label: "Home Delivery Available" },
              { value: "both", label: "Pickup & Delivery" },
            ]}
          />

          {/* Media */}
          <FormField
            label="Image / Media URL"
            name="mediaUrl"
            placeholder="https://example.com/item-image.jpg"
          />

          {/* Description */}
          <FormField
            label="Description"
            name="description"
            placeholder="Provide details about the item"
            type="textarea"
          />

          {/* Location */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Location</h3>
          <FormField
            label="City"
            name="__ignore_city"
            placeholder="Enter City"
            value={formData.location?.city || ""}
            onChange={(e) => handleLocationChange("city", e.target.value)}
          />
          <FormField
            label="State"
            name="__ignore_state"
            placeholder="Enter State"
            value={formData.location?.state || ""}
            onChange={(e) => handleLocationChange("state", e.target.value)}
          />
          <FormField
            label="Zipcode"
            name="__ignore_zipcode"
            placeholder="Enter Zipcode"
            value={formData.location?.zipcode || ""}
            onChange={(e) => handleLocationChange("zipcode", e.target.value)}
          />

          {/* Seller Info */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Seller Information</h3>
          <FormField
            label="Name"
            name="__ignore_name"
            placeholder="Contact Person"
            value={formData.sellerInfo?.name || ""}
            onChange={(e) => handleSellerInfoChange("name", e.target.value)}
          />
          <FormField
            label="Email"
            name="__ignore_email"
            type="email"
            placeholder="Email Address"
            value={formData.sellerInfo?.email || ""}
            onChange={(e) => handleSellerInfoChange("email", e.target.value)}
          />
          <FormField
            label="Phone"
            name="__ignore_phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.sellerInfo?.phone || ""}
            onChange={(e) => handleSellerInfoChange("phone", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
