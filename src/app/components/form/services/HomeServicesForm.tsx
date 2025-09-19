"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HomeServiceForm() {
  const [formData, setFormData] = useState({
    serviceType: "",
    serviceTitle: "",
    description: "",
    availability: "",
    experience: "",
    location: "",
    serviceCharge: "",
    contactName: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Home Service Data Submitted:", formData);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Post Home Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Service Type */}
          <div>
            <Label>Service Type</Label>
            <Select onValueChange={(value) => handleSelectChange("serviceType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
                <SelectItem value="pest-control">Pest Control</SelectItem>
                <SelectItem value="gardening">Gardening</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Title */}
          <div>
            <Label>Service Title</Label>
            <Input name="serviceTitle" value={formData.serviceTitle} onChange={handleChange} placeholder="e.g., Professional Home Cleaning Service" />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your service in detail" />
          </div>

          {/* Availability */}
          <div>
            <Label>Availability</Label>
            <Input name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., Weekdays 9AM - 6PM" />
          </div>

          {/* Experience */}
          <div>
            <Label>Experience</Label>
            <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g., 5 years in plumbing services" />
          </div>

          {/* Location */}
          <div>
            <Label>Service Location</Label>
            <Input name="location" value={formData.location} onChange={handleChange} placeholder="City / Area" />
          </div>

          {/* Service Charge */}
          <div>
            <Label>Service Charge</Label>
            <Input type="number" name="serviceCharge" value={formData.serviceCharge} onChange={handleChange} placeholder="e.g., 500 per visit" />
          </div>

          {/* Contact Info */}
          <div>
            <Label>Contact Name</Label>
            <Input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Enter Your Name" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone Number" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email Address" />
          </div>

          <Button type="submit" className="w-full">Submit Service</Button>
        </form>
      </CardContent>
    </Card>
  );
}
