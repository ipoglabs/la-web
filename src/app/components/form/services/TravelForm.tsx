"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function TravelServiceForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    serviceType: "",
    destination: "",
    packageDetails: "",
    duration: "",
    price: "",
    availability: "",
    agencyName: "",
    contactNumber: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Travel Service Submitted:", formData);
    router.push("/success");
  };

  return (
    <Card className="max-w-2xl mx-auto my-10 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Post Travel Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label>Service Type (Tour/Package/Guide/Transport)</Label>
            <Input
              name="serviceType"
              placeholder="e.g., Tour Package, Cab Service"
              value={formData.serviceType}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Destination</Label>
            <Input
              name="destination"
              placeholder="e.g., Goa, Paris, Manali"
              value={formData.destination}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Package Details</Label>
            <Textarea
              name="packageDetails"
              placeholder="e.g., Includes Hotel, Flight, Sightseeing..."
              value={formData.packageDetails}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Duration</Label>
            <Input
              name="duration"
              placeholder="e.g., 5 Days / 4 Nights"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              placeholder="e.g., 25000"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Availability</Label>
            <Input
              name="availability"
              placeholder="e.g., Year-round, Seasonal"
              value={formData.availability}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Agency Name</Label>
            <Input
              name="agencyName"
              placeholder="Enter agency name"
              value={formData.agencyName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Contact Number</Label>
            <Input
              name="contactNumber"
              type="tel"
              placeholder="Enter contact number"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Write extra details about your travel service..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Travel Service
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
