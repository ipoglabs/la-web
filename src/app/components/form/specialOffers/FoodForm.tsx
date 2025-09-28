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

export default function FoodDiningForm() {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    location: "",
    priceRange: "",
    cuisineType: "",
    openingHours: "",
    deliveryOption: "",
    website: "",
    menuLink: "",
    averageRating: "",
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
        <h2 className="text-2xl font-bold mb-6">Food & Dining Service</h2>

        <div className="space-y-4">
          {/* Service Name */}
          <div>
            <Label>Service / Restaurant Name</Label>
            <Input
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Name of the restaurant or food service"
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
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="delivery">Food Delivery</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
                <SelectItem value="streetfood">Street Food</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the food, service, or ambiance"
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Area, or Address"
            />
          </div>

          {/* Price Range */}
          <div>
            <Label>Price Range</Label>
            <Input
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              placeholder="e.g. ₹200 - ₹500 per person"
            />
          </div>

          {/* Cuisine Type */}
          <div>
            <Label>Cuisine Type</Label>
            <Input
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              placeholder="e.g. Italian, Chinese, Indian"
            />
          </div>

          {/* Opening Hours */}
          <div>
            <Label>Opening Hours</Label>
            <Input
              name="openingHours"
              value={formData.openingHours}
              onChange={handleChange}
              placeholder="e.g. 10 AM - 11 PM"
            />
          </div>

          {/* Delivery Option */}
          <div>
            <Label>Delivery Option</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("deliveryOption", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="thirdparty">
                  Available via Swiggy / Zomato
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Website */}
          <div>
            <Label>Website</Label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://restaurant.com"
            />
          </div>

          {/* Menu Link */}
          <div>
            <Label>Menu Link (optional)</Label>
            <Input
              type="url"
              name="menuLink"
              value={formData.menuLink}
              onChange={handleChange}
              placeholder="https://restaurant.com/menu"
            />
          </div>

          {/* Average Rating */}
          <div>
            <Label>Average Rating</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="averageRating"
              value={formData.averageRating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
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
