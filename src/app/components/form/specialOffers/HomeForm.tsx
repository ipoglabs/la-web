"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HomeLivingForm() {
  const [formData, setFormData] = useState({
    itemName: "",
    brandName: "",
    category: "",
    condition: "",
    material: "",
    dimensions: "",
    color: "",
    weight: "",
    warranty: "",
    usageDuration: "",
    price: "",
    location: "",
    deliveryOption: "",
    mediaUrl: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Home & Living</h2>

        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <Label>Item Name</Label>
            <Input
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g. Sofa, Dining Table, Lamp"
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <Label>Brand Name</Label>
            <Input
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Brand or Manufacturer"
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="home-decor">Home Decor</SelectItem>
                <SelectItem value="appliances">Appliances</SelectItem>
                <SelectItem value="kitchenware">Kitchenware</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label>Condition</Label>
            <Select
              onValueChange={(value) => handleSelectChange("condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="refurbished">Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Material */}
          <div>
            <Label>Material</Label>
            <Input
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Wood, Metal, Fabric"
            />
          </div>

          {/* Dimensions */}
          <div>
            <Label>Dimensions (L x W x H)</Label>
            <Input
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="e.g. 6ft x 3ft x 2.5ft"
            />
          </div>

          {/* Color */}
          <div>
            <Label>Color</Label>
            <Input
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Black, Beige, Oak"
            />
          </div>

          {/* Weight */}
          <div>
            <Label>Weight</Label>
            <Input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 25kg"
            />
          </div>

          {/* Warranty */}
          <div>
            <Label>Warranty</Label>
            <Input
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              placeholder="e.g. 1 Year"
            />
          </div>

          {/* Usage Duration */}
          <div>
            <Label>Usage Duration (if used)</Label>
            <Input
              name="usageDuration"
              value={formData.usageDuration}
              onChange={handleChange}
              placeholder="e.g. 6 months, 2 years"
            />
          </div>

          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. ₹15,000"
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
            />
          </div>

          {/* Delivery Option */}
          <div>
            <Label>Delivery / Pickup Option</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("deliveryOption", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup Only</SelectItem>
                <SelectItem value="delivery">Home Delivery Available</SelectItem>
                <SelectItem value="both">Pickup & Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image / Media */}
          <div>
            <Label>Image / Media URL</Label>
            <Input
              type="url"
              name="mediaUrl"
              value={formData.mediaUrl}
              onChange={handleChange}
              placeholder="https://example.com/item-image.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the item"
            />
          </div>

          {/* Contact Info */}
          <div>
            <Label>Contact Name</Label>
            <Input
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Contact Person"
            />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>
          <div>
            <Label>Contact Phone</Label>
            <Input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
