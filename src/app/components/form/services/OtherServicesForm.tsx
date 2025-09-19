"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function OtherServiceForm() {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceType: "",
    description: "",
    price: "",
    availability: "",
    location: "",
    contactName: "",
    contactNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Other Service Form Submitted:", formData);
    // Submit logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-semibold">Other Service Form</h2>

      <div>
        <Label>Service Title</Label>
        <Input name="serviceTitle" value={formData.serviceTitle} onChange={handleChange} placeholder="Enter service title" required />
      </div>

      <div>
        <Label>Service Type</Label>
        <Input name="serviceType" value={formData.serviceType} onChange={handleChange} placeholder="E.g., Repair, Consultancy, Miscellaneous" required />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the service offered" required />
      </div>

      <div>
        <Label>Price (₹)</Label>
        <Input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price or rate" />
      </div>

      <div>
        <Label>Availability</Label>
        <Input name="availability" value={formData.availability} onChange={handleChange} placeholder="E.g., Weekdays, Weekends, Anytime" />
      </div>

      <div>
        <Label>Location</Label>
        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Enter service location" required />
      </div>

      <h3 className="text-lg font-medium mt-4">Contact Information</h3>

      <div>
        <Label>Contact Name</Label>
        <Input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Enter your name" required />
      </div>

      <div>
        <Label>Contact Number</Label>
        <Input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter contact number" required />
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
      </div>

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
