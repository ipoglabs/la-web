"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function HealthServiceForm() {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceType: "",
    providerName: "",
    qualification: "",
    experience: "",
    location: "",
    consultationMode: "",
    consultationFee: "",
    availability: "",
    contactNumber: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Health Service Form Data:", formData);
    // API call here
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Post Health Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label>Service Title</Label>
            <Input
              name="serviceTitle"
              value={formData.serviceTitle}
              onChange={handleChange}
              placeholder="e.g., Physiotherapy, Online Yoga, Dental Checkup"
              required
            />
          </div>

          <div>
            <Label>Service Type</Label>
            <Input
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              placeholder="Doctor, Therapist, Fitness Trainer, Clinic"
              required
            />
          </div>

          <div>
            <Label>Provider Name</Label>
            <Input
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              placeholder="Enter provider's full name"
              required
            />
          </div>

          <div>
            <Label>Qualification</Label>
            <Input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g., MBBS, Physiotherapist, Certified Trainer"
            />
          </div>

          <div>
            <Label>Experience</Label>
            <Input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 5 years"
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Area"
              required
            />
          </div>

          <div>
            <Label>Consultation Mode</Label>
            <Input
              name="consultationMode"
              value={formData.consultationMode}
              onChange={handleChange}
              placeholder="Online, In-person, Both"
              required
            />
          </div>

          <div>
            <Label>Consultation Fee</Label>
            <Input
              name="consultationFee"
              type="number"
              value={formData.consultationFee}
              onChange={handleChange}
              placeholder="Enter fee in INR"
            />
          </div>

          <div>
            <Label>Availability</Label>
            <Input
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g., Mon-Fri 9 AM - 6 PM"
            />
          </div>

          <div>
            <Label>Contact Number</Label>
            <Input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label>Service Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write details about the service provided..."
              required
            />
          </div>

          <Button type="submit" className="w-full">Submit Health Service</Button>
        </form>
      </CardContent>
    </Card>
  );
}
