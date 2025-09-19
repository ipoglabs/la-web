"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BusinessServiceForm() {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    businessType: "",
    description: "",
    location: "",
    experience: "",
    availability: "",
    priceRange: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Business Service Form Submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 border rounded-xl shadow-md bg-white"
    >
      <h2 className="text-2xl font-bold mb-4">Business Service Form</h2>

      {/* Service Title */}
      <div>
        <Label>Service Title</Label>
        <Input
          name="serviceTitle"
          value={formData.serviceTitle}
          onChange={handleChange}
          placeholder="e.g. Accounting, Marketing, IT Support"
        />
      </div>

      {/* Business Type */}
      <div>
        <Label>Business Type</Label>
        <Input
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          placeholder="e.g. Consultancy, Repair, Freelance"
        />
      </div>

      {/* Description */}
      <div>
        <Label>Service Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your business service in detail..."
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

      {/* Experience */}
      <div>
        <Label>Experience (Years)</Label>
        <Input
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="e.g. 5 Years"
        />
      </div>

      {/* Availability */}
      <div>
        <Label>Availability</Label>
        <Input
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          placeholder="e.g. Full-time, Part-time, Flexible"
        />
      </div>

      {/* Price Range */}
      <div>
        <Label>Price Range</Label>
        <Input
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          placeholder="e.g. ₹5000 - ₹20000 / project"
        />
      </div>

      {/* Contact Info */}
      <div>
        <Label>Contact Name</Label>
        <Input
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          placeholder="Your Full Name"
        />
      </div>

      <div>
        <Label>Contact Email</Label>
        <Input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="example@email.com"
        />
      </div>

      <div>
        <Label>Contact Phone</Label>
        <Input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          placeholder="+91 9876543210"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full">
        Post Business Service
      </Button>
    </form>
  );
}
