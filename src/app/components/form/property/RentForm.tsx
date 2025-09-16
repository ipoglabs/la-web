"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

export default function RentPropertyForm() {
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    rent: "",
    deposit: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "",
    availableFrom: "",
    leaseTerm: "",
    location: "",
    amenities: [] as string[],
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Post a Rental Property</h2>

      {/* 🚫 Removed <form> wrapper */}

      {/* Basic Info */}
      <div className="col-span-2">
        <Label>Title</Label>
        <Input name="title" onChange={handleChange} placeholder="Spacious 2BHK for rent" />
      </div>

      <div>
        <Label>Property Type</Label>
        <Input name="propertyType" onChange={handleChange} placeholder="Apartment / Villa / House" />
      </div>

      <div>
        <Label>Monthly Rent (₹)</Label>
        <Input name="rent" type="number" onChange={handleChange} placeholder="15000" />
      </div>

      <div>
        <Label>Deposit (₹)</Label>
        <Input name="deposit" type="number" onChange={handleChange} placeholder="50000" />
      </div>

      <div>
        <Label>Bedrooms</Label>
        <Input name="bedrooms" type="number" onChange={handleChange} placeholder="2" />
      </div>

      <div>
        <Label>Bathrooms</Label>
        <Input name="bathrooms" type="number" onChange={handleChange} placeholder="2" />
      </div>

      <div>
        <Label>Furnishing</Label>
        <Input name="furnishing" onChange={handleChange} placeholder="Furnished / Semi-furnished / Unfurnished" />
      </div>

      <div>
        <Label>Available From</Label>
        <Input name="availableFrom" type="date" onChange={handleChange} />
      </div>

      <div>
        <Label>Lease Term</Label>
        <Input name="leaseTerm" onChange={handleChange} placeholder="11 months / 1 year" />
      </div>

      <div className="col-span-2">
        <Label>Location</Label>
        <Input name="location" onChange={handleChange} placeholder="City, Area, Pincode" />
      </div>

      {/* Amenities */}
      <div className="col-span-2">
        <Label>Amenities</Label>
        <div className="flex gap-4 flex-wrap mt-2">
          {["Parking", "Lift", "Power Backup", "Gym", "Swimming Pool"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => handleAmenityChange(amenity)}
              />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="col-span-2">
        <Label>Description</Label>
        <Textarea name="description" onChange={handleChange} placeholder="Describe your property" />
      </div>

      {/* Contact Details */}
      <div>
        <Label>Contact Name</Label>
        <Input name="contactName" onChange={handleChange} />
      </div>

      <div>
        <Label>Contact Phone</Label>
        <Input name="contactPhone" onChange={handleChange} />
      </div>

      <div>
        <Label>Contact Email</Label>
        <Input name="contactEmail" onChange={handleChange} />
      </div>

      {/* 🚫 Removed submit button here – parent form will handle submission */}
    </Card>
  );
}
