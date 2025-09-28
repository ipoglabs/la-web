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

export default function EntertainmentForm() {
  const [formData, setFormData] = useState({
    eventTitle: "",
    organizerName: "",
    category: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    ticketPrice: "",
    ageRestriction: "",
    website: "",
    socialMedia: "",
    description: "",
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
        <h2 className="text-2xl font-bold mb-6">Entertainment Event</h2>

        <div className="space-y-4">
          {/* Event Title */}
          <div>
            <Label>Event / Entertainment Title</Label>
            <Input
              name="eventTitle"
              value={formData.eventTitle}
              onChange={handleChange}
              placeholder="e.g. Live Concert, Movie Premiere"
              required
            />
          </div>

          {/* Organizer */}
          <div>
            <Label>Organizer / Company Name</Label>
            <Input
              name="organizerName"
              value={formData.organizerName}
              onChange={handleChange}
              placeholder="Organizer Name"
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
                <SelectItem value="concert">Concert</SelectItem>
                <SelectItem value="movie">Movie / Premiere</SelectItem>
                <SelectItem value="theater">Theater / Play</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Event Date</Label>
              <Input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Venue, or Online"
            />
          </div>

          {/* Ticket Price */}
          <div>
            <Label>Ticket Price / Entry Fee</Label>
            <Input
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              placeholder="e.g. ₹500, Free Entry"
            />
          </div>

          {/* Age Restriction */}
          <div>
            <Label>Age Restriction</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("ageRestriction", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Age Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="13+">13+</SelectItem>
                <SelectItem value="18+">18+</SelectItem>
                <SelectItem value="21+">21+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Website */}
          <div>
            <Label>Event Website (optional)</Label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          {/* Social Media */}
          <div>
            <Label>Social Media Link</Label>
            <Input
              type="url"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleChange}
              placeholder="Facebook / Instagram Event Link"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide event details, highlights, and special guests"
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
