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

export default function EducationLearningForm() {
  const [formData, setFormData] = useState({
    courseTitle: "",
    institutionName: "",
    category: "",
    mode: "",
    duration: "",
    fees: "",
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
        <h2 className="text-2xl font-bold mb-6">Education & Learning Form</h2>

        <div className="space-y-4">
          {/* Course / Program Title */}
          <div>
            <Label>Course / Program Title</Label>
            <Input
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              placeholder="e.g. Data Science Bootcamp"
              required
            />
          </div>

          {/* Institution Name */}
          <div>
            <Label>Institution / Provider</Label>
            <Input
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              placeholder="Organization or Institution Name"
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
                <SelectItem value="school">School / Academic</SelectItem>
                <SelectItem value="college">College / University</SelectItem>
                <SelectItem value="vocational">
                  Vocational / Skill-based
                </SelectItem>
                <SelectItem value="online-course">Online Course</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode */}
          <div>
            <Label>Mode</Label>
            <Select onValueChange={(value) => handleSelectChange("mode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label>Duration</Label>
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 3 months, 6 weeks, 1 year"
            />
          </div>

          {/* Fees */}
          <div>
            <Label>Fees / Tuition</Label>
            <Input
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              placeholder="e.g. ₹20,000, Free"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the course or program"
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
