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

export default function HealthWellnessForm() {
  const [formData, setFormData] = useState({
    serviceName: "",
    providerName: "",
    category: "",
    serviceType: "",
    price: "",
    duration: "",
    availability: "",
    certifications: "",
    experience: "",
    website: "",
    languages: "",
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
        <h2 className="text-2xl font-bold mb-6">Health & Wellness Service</h2>

        <div className="space-y-4">
          {/* Service Name */}
          <div>
            <Label>Service Name</Label>
            <Input
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g. Yoga Classes, Nutrition Consultation"
              required
            />
          </div>

          {/* Provider Name */}
          <div>
            <Label>Provider Name</Label>
            <Input
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              placeholder="Organization or Individual Name"
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
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="wellness-products">
                  Wellness Products
                </SelectItem>
                <SelectItem value="therapy">Therapy / Counseling</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Type */}
          <div>
            <Label>Service Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange("serviceType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <Label>Price / Fees</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. ₹500/session or ₹3000/month"
            />
          </div>

          {/* Duration */}
          <div>
            <Label>Duration</Label>
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 1 hour session, 3 months program"
            />
          </div>

          {/* Availability */}
          <div>
            <Label>Availability / Schedule</Label>
            <Input
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g. Mon-Fri, 9 AM - 6 PM"
            />
          </div>

          {/* Certifications */}
          <div>
            <Label>Certifications / Qualifications</Label>
            <Input
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="e.g. Certified Yoga Instructor, Nutritionist"
            />
          </div>

          {/* Experience */}
          <div>
            <Label>Experience</Label>
            <Input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 5 years in industry"
            />
          </div>

          {/* Website */}
          <div>
            <Label>Website / Booking Link</Label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://wellness-service.com"
            />
          </div>

          {/* Languages */}
          <div>
            <Label>Languages Supported</Label>
            <Input
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="e.g. English, Hindi"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the service"
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State or Online"
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
