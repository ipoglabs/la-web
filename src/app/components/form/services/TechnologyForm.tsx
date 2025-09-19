"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function TechnologyServiceForm() {
  const [formData, setFormData] = useState({
    serviceType: "",
    title: "",
    description: "",
    skills: "",
    experience: "",
    availability: "",
    location: "",
    rateType: "",
    rate: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Technology Service Data:", formData);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-md rounded-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Technology Service Form</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Service Type */}
          <div>
            <Label>Service Type</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it-support">IT Support</SelectItem>
                <SelectItem value="software-development">Software Development</SelectItem>
                <SelectItem value="web-design">Web Design & Development</SelectItem>
                <SelectItem value="networking">Networking & Security</SelectItem>
                <SelectItem value="repair">Hardware/Device Repair</SelectItem>
                <SelectItem value="consulting">Tech Consulting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              placeholder="e.g., Professional Web Developer"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Service Description</Label>
            <Textarea
              name="description"
              placeholder="Describe your service in detail..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Skills / Expertise</Label>
            <Input
              name="skills"
              placeholder="e.g., JavaScript, React, Networking, AWS"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <div>
            <Label>Experience (Years)</Label>
            <Input
              type="number"
              name="experience"
              placeholder="e.g., 5"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          {/* Availability */}
          <div>
            <Label>Availability</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, availability: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-Time</SelectItem>
                <SelectItem value="part-time">Part-Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              placeholder="City / Online"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rate Type</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, rateType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="project">Per Project</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rate</Label>
              <Input
                type="number"
                name="rate"
                placeholder="Enter rate"
                value={formData.rate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contact Info */}
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
            <Label>Email</Label>
            <Input
              type="email"
              name="contactEmail"
              placeholder="you@example.com"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              name="contactPhone"
              placeholder="+91 9876543210"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Service
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
