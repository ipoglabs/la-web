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

export default function HolidayOffersForm() {
  const [formData, setFormData] = useState({
    offerTitle: "",
    providerName: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    price: "",
    discount: "",
    couponCode: "",
    bookingLink: "",
    maxParticipants: "",
    audience: "",
    mediaUrl: "",
    description: "",
    terms: "",
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
        <h2 className="text-2xl font-bold mb-6">Holiday & Seasonal Offers</h2>

        <div className="space-y-4">
          {/* Offer Title */}
          <div>
            <Label>Offer Title</Label>
            <Input
              name="offerTitle"
              value={formData.offerTitle}
              onChange={handleChange}
              placeholder="e.g. Summer Special Package"
              required
            />
          </div>

          {/* Provider Name */}
          <div>
            <Label>Provider / Company Name</Label>
            <Input
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              placeholder="Organization or Company Name"
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
                <SelectItem value="holiday-packages">
                  Holiday Packages
                </SelectItem>
                <SelectItem value="seasonal-sale">Seasonal Sale</SelectItem>
                <SelectItem value="special-offers">Special Offers</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Price */}
          <div>
            <Label>Price / Cost</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. ₹15,000, Free"
            />
          </div>

          {/* Discount */}
          <div>
            <Label>Discount / Deal</Label>
            <Input
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="e.g. 20% off, Buy 1 Get 1"
            />
          </div>

          {/* Coupon Code */}
          <div>
            <Label>Coupon Code / Voucher</Label>
            <Input
              name="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              placeholder="e.g. SUMMER2025"
            />
          </div>

          {/* Booking / Registration Link */}
          <div>
            <Label>Booking / Registration Link</Label>
            <Input
              type="url"
              name="bookingLink"
              value={formData.bookingLink}
              onChange={handleChange}
              placeholder="https://book-now.com/offer"
            />
          </div>

          {/* Max Participants */}
          <div>
            <Label>Max Participants / Availability</Label>
            <Input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              placeholder="e.g. 100 slots"
            />
          </div>

          {/* Target Audience */}
          <div>
            <Label>Target Audience</Label>
            <Input
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              placeholder="e.g. Families, Couples, Students"
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
              placeholder="https://example.com/offer-banner.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the offer"
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <Label>Terms & Conditions</Label>
            <Textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              placeholder="Mention important terms of the offer"
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
