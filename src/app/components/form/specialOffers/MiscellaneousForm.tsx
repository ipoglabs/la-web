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

export default function MiscellaneousForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    condition: "",
    brand: "",
    model: "",
    usageDuration: "",
    age: "",
    exchangeOption: "",
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
        <h2 className="text-2xl font-bold mb-6">Miscellaneous</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Listing Title"
              required
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
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home-furniture">Home & Furniture</SelectItem>
                <SelectItem value="books-media">Books & Media</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="collectibles">Collectibles</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div>
            <Label>Subcategory</Label>
            <Input
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              placeholder="e.g. Tools, Art, Musical Instruments"
            />
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

          {/* Brand */}
          <div>
            <Label>Brand (if applicable)</Label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Philips, Sony"
            />
          </div>

          {/* Model */}
          <div>
            <Label>Model</Label>
            <Input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Model name or number"
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

          {/* Age of Item */}
          <div>
            <Label>Age of Item</Label>
            <Input
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 1 year old"
            />
          </div>

          {/* Exchange Option */}
          <div>
            <Label>Exchange/Trade Option</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("exchangeOption", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
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
              placeholder="e.g. ₹5,000"
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
                <SelectItem value="delivery">Delivery Available</SelectItem>
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
              placeholder="Provide details about the item or service"
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
