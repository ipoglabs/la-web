"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function TravelTourismForm() {
  const [formData, setFormData] = useState({
    tourTitle: "",
    tourType: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    duration: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    accommodation: "",
    transport: "",
    groupSize: "",
    bookingDeadline: "",
    price: "",
    specialOffers: "",
    cancellationPolicy: "",
    mediaUrl: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Travel & Tourism Form Submitted:", formData);
    // Add API call logic here
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Travel & Tourism Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tour Title */}
          <div>
            <Label>Tour / Package Title</Label>
            <Input
              name="tourTitle"
              value={formData.tourTitle}
              onChange={handleChange}
              placeholder="Title of the tour or package"
              required
            />
          </div>

          {/* Tour Type */}
          <div>
            <Label>Tour Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange("tourType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tour Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domestic">Domestic</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="cruise">Cruise</SelectItem>
                <SelectItem value="honeymoon">Honeymoon</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the tour or package"
              required
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location / Destination</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City / Destination"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label>Duration</Label>
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 5 Days / 4 Nights"
            />
          </div>

          {/* Itinerary */}
          <div>
            <Label>Itinerary / Highlights</Label>
            <Textarea
              name="itinerary"
              value={formData.itinerary}
              onChange={handleChange}
              placeholder="Key attractions / day-wise plan"
            />
          </div>

          {/* Inclusions */}
          <div>
            <Label>Inclusions</Label>
            <Textarea
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              placeholder="Meals, Hotel, Transport, Guide, etc."
            />
          </div>

          {/* Exclusions */}
          <div>
            <Label>Exclusions</Label>
            <Textarea
              name="exclusions"
              value={formData.exclusions}
              onChange={handleChange}
              placeholder="Not included in the package"
            />
          </div>

          {/* Accommodation */}
          <div>
            <Label>Accommodation Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange("accommodation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Accommodation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="resort">Resort</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="camp">Camp</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transport */}
          <div>
            <Label>Transport Mode</Label>
            <Select
              onValueChange={(value) => handleSelectChange("transport", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="cruise">Cruise</SelectItem>
                <SelectItem value="own">Own Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Size */}
          <div>
            <Label>Group Size / Capacity</Label>
            <Input
              name="groupSize"
              value={formData.groupSize}
              onChange={handleChange}
              placeholder="e.g. Max 20 people"
            />
          </div>

          {/* Booking Deadline */}
          <div>
            <Label>Booking Deadline</Label>
            <Input
              type="date"
              name="bookingDeadline"
              value={formData.bookingDeadline}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div>
            <Label>Price / Package Cost</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Cost of the tour/package"
            />
          </div>

          {/* Special Offers */}
          <div>
            <Label>Special Offers / Discounts</Label>
            <Input
              name="specialOffers"
              value={formData.specialOffers}
              onChange={handleChange}
              placeholder="e.g. Early bird discount"
            />
          </div>

          {/* Cancellation Policy */}
          <div>
            <Label>Cancellation Policy</Label>
            <Textarea
              name="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={handleChange}
              placeholder="e.g. 50% refund before 7 days"
            />
          </div>

          {/* Media */}
          <div>
            <Label>Image / Media URL</Label>
            <Input
              type="url"
              name="mediaUrl"
              value={formData.mediaUrl}
              onChange={handleChange}
              placeholder="https://example.com/package.jpg"
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

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Travel / Tourism Package
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
