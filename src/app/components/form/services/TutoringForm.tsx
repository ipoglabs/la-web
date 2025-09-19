"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function TutoringForm() {
  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    mode: "",
    qualification: "",
    experience: "",
    availability: "",
    location: "",
    hourlyRate: "",
    contactName: "",
    contactNumber: "",
    email: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tutoring Form Submitted:", formData);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Tutoring Service Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Input
              placeholder="e.g. Mathematics, English, Physics"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
            />
          </div>

          {/* Level */}
          <div>
            <Label>Level</Label>
            <Select onValueChange={(value) => handleChange("level", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="higher-secondary">Higher Secondary</SelectItem>
                <SelectItem value="college">College/University</SelectItem>
                <SelectItem value="competitive">Competitive Exams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode */}
          <div>
            <Label>Mode</Label>
            <Select onValueChange={(value) => handleChange("mode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Qualification */}
          <div>
            <Label>Qualification</Label>
            <Input
              placeholder="e.g. MSc Mathematics, B.Ed"
              value={formData.qualification}
              onChange={(e) => handleChange("qualification", e.target.value)}
            />
          </div>

          {/* Experience */}
          <div>
            <Label>Experience (in years)</Label>
            <Input
              type="number"
              placeholder="e.g. 5"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
            />
          </div>

          {/* Availability */}
          <div>
            <Label>Availability</Label>
            <Input
              placeholder="e.g. Weekdays evenings, Weekends"
              value={formData.availability}
              onChange={(e) => handleChange("availability", e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location (if offline)</Label>
            <Input
              placeholder="City / Area"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <Label>Hourly Rate</Label>
            <Input
              type="number"
              placeholder="e.g. 500 INR"
              value={formData.hourlyRate}
              onChange={(e) => handleChange("hourlyRate", e.target.value)}
            />
          </div>

          {/* Contact Name */}
          <div>
            <Label>Contact Name</Label>
            <Input
              placeholder="Tutor's Name"
              value={formData.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
          </div>

          {/* Contact Number */}
          <div>
            <Label>Contact Number</Label>
            <Input
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={formData.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="e.g. tutor@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Additional Information</Label>
            <Textarea
              placeholder="Briefly describe your teaching approach, experience, etc."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
