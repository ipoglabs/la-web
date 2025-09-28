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

export default function ElectronicsGadgetsForm() {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    category: "",
    condition: "",
    price: "",
    description: "",
    location: "",
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
        <h2 className="text-2xl font-bold mb-6">Electronics & Gadgets</h2>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <Label>Product Name</Label>
            <Input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g. iPhone 14, Samsung TV"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <Label>Brand</Label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand name"
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
                <SelectItem value="mobile">Mobile Phones</SelectItem>
                <SelectItem value="laptop">Laptops</SelectItem>
                <SelectItem value="tv">Televisions</SelectItem>
                <SelectItem value="camera">Cameras</SelectItem>
                <SelectItem value="audio">Audio Devices</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
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

          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. ₹20,000"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the product"
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
