"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceWantedForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    location: "",
    budget: "",
    urgency: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Service Wanted Form Submitted:", formData);
    // Here you would POST to your backend API
    router.push("/thank-you");
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Request a Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label>Service Type</Label>
            <Input
              name="serviceType"
              placeholder="e.g., Plumbing, Tutoring, Moving Help"
              value={formData.serviceType}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Description of Service Needed</Label>
            <Textarea
              name="description"
              placeholder="Provide details of the service you are looking for"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              placeholder="City / Area"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Budget (if applicable)</Label>
            <Input
              name="budget"
              placeholder="e.g., ₹5000 or Negotiable"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Urgency</Label>
            <Input
              name="urgency"
              placeholder="e.g., Immediate, Within a week"
              value={formData.urgency}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Your Name</Label>
            <Input
              name="contactName"
              placeholder="Enter your name"
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="contactEmail"
              placeholder="Enter your email"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              name="contactPhone"
              placeholder="Enter your phone number"
              value={formData.contactPhone}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );
}
