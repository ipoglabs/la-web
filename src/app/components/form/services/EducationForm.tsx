"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EducationForm() {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    educationType: "",
    subject: "",
    mode: "",
    qualification: "",
    experience: "",
    availability: "",
    location: "",
    fees: "",
    description: "",
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
    console.log("Education Service Submitted:", formData);
  };

  return (
    <Card className="max-w-3xl mx-auto my-6 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Post Education Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Service Title */}
          <div>
            <Label>Service Title</Label>
            <Input
              name="serviceTitle"
              placeholder="e.g., Mathematics Tutoring, IELTS Coaching"
              value={formData.serviceTitle}
              onChange={handleChange}
            />
          </div>

          {/* Education Type */}
          <div>
            <Label>Education Type</Label>
            <select
              name="educationType"
              value={formData.educationType}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="tutoring">Tutoring</option>
              <option value="coaching">Coaching/Training Center</option>
              <option value="online">Online Courses</option>
              <option value="school">School/College Classes</option>
              <option value="language">Language Classes</option>
              <option value="professional">Professional Certification</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <Label>Subject / Course</Label>
            <Input
              name="subject"
              placeholder="e.g., Physics, IELTS, Graphic Design"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          {/* Mode of Study */}
          <div>
            <Label>Mode of Study</Label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="offline">Offline (In-person)</option>
              <option value="online">Online</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Qualification */}
          <div>
            <Label>Required Qualification (if any)</Label>
            <Input
              name="qualification"
              placeholder="e.g., B.Sc., High School, Open for All"
              value={formData.qualification}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <div>
            <Label>Trainer / Teacher Experience</Label>
            <Input
              name="experience"
              placeholder="e.g., 5 years teaching experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          {/* Availability */}
          <div>
            <Label>Availability / Schedule</Label>
            <Input
              name="availability"
              placeholder="e.g., Weekdays evenings, Weekends"
              value={formData.availability}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              placeholder="e.g., New Delhi, Online"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Fees */}
          <div>
            <Label>Fees / Price</Label>
            <Input
              name="fees"
              placeholder="e.g., ₹5000 per course / ₹500 per hour"
              value={formData.fees}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Additional Information</Label>
            <Textarea
              name="description"
              placeholder="Provide details about the service, topics covered, teaching method..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Contact Name</Label>
              <Input
                name="contactName"
                placeholder="Your Name"
                value={formData.contactName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input
                name="contactEmail"
                placeholder="example@email.com"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                name="contactPhone"
                placeholder="+91 9876543210"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Post Education Service
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
