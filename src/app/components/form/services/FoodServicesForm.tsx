"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function FoodServiceForm() {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceType: "",
    cuisineType: "",
    dietaryOptions: [],
    priceRange: "",
    location: "",
    deliveryAvailable: "",
    contactName: "",
    contactNumber: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Food Service Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold text-center">Food Service Form</h2>

      {/* Service Title */}
      <div>
        <Label>Service Title</Label>
        <Input name="serviceTitle" value={formData.serviceTitle} onChange={handleChange} placeholder="Eg: Home-cooked Tiffin Service" required />
      </div>

      {/* Service Type */}
      <div>
        <Label>Service Type</Label>
        <Select name="serviceType" onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home-cooked">Home Cooked</SelectItem>
            <SelectItem value="tiffin">Tiffin Service</SelectItem>
            <SelectItem value="catering">Catering</SelectItem>
            <SelectItem value="restaurant">Restaurant Service</SelectItem>
            <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cuisine Type */}
      <div>
        <Label>Cuisine Type</Label>
        <Input name="cuisineType" value={formData.cuisineType} onChange={handleChange} placeholder="Eg: Indian, Chinese, Italian" />
      </div>

      {/* Dietary Options */}
      <div>
        <Label>Dietary Options</Label>
        <Input
          name="dietaryOptions"
          value={formData.dietaryOptions}
          onChange={handleChange}
          placeholder="Eg: Vegetarian, Vegan, Gluten-Free"
        />
      </div>

      {/* Price Range */}
      <div>
        <Label>Price Range</Label>
        <Input name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="Eg: ₹100 - ₹500 per meal" />
      </div>

      {/* Location */}
      <div>
        <Label>Location</Label>
        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Eg: Chennai, TN" />
      </div>

      {/* Delivery Available */}
      <div>
        <Label>Delivery Available</Label>
        <Select name="deliveryAvailable" onValueChange={(value) => setFormData({ ...formData, deliveryAvailable: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact Name */}
      <div>
        <Label>Contact Name</Label>
        <Input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Enter contact name" />
      </div>

      {/* Contact Number */}
      <div>
        <Label>Contact Number</Label>
        <Input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter phone number" />
      </div>

      {/* Description */}
      <div>
        <Label>Service Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your service" rows={4} />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full">Submit Food Service</Button>
    </form>
  );
}
