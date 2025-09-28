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

export default function RetailShoppingForm() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    brand: "",
    model: "",
    size: "",
    color: "",
    material: "",
    warranty: "",
    returnPolicy: "",
    offers: "",
    description: "",
    location: "",
    price: "",
    quantity: "",
    condition: "",
    deliveryOption: "",
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
    console.log("Retail & Shopping Form Submitted:", formData);
    // Add API call here
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Retail & Shopping Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <Label>Product Name</Label>
            <Input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Name of the product"
              required
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
                <SelectItem value="fashion">Fashion & Accessories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="home">Home & Furniture</SelectItem>
                <SelectItem value="sports">Sports & Fitness</SelectItem>
                <SelectItem value="beauty">Health & Beauty</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div>
            <Label>Brand</Label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Nike, Samsung"
            />
          </div>

          {/* Model */}
          <div>
            <Label>Model</Label>
            <Input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Model name or number"
            />
          </div>

          {/* Size / Dimensions */}
          <div>
            <Label>Size / Dimensions</Label>
            <Input
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g. M, 42-inch, 6ft x 4ft"
            />
          </div>

          {/* Color */}
          <div>
            <Label>Color</Label>
            <Input
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Red, Black"
            />
          </div>

          {/* Material */}
          <div>
            <Label>Material</Label>
            <Input
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Cotton, Leather, Wood"
            />
          </div>

          {/* Warranty */}
          <div>
            <Label>Warranty / Guarantee</Label>
            <Input
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              placeholder="e.g. 1 year warranty"
            />
          </div>

          {/* Return Policy */}
          <div>
            <Label>Return Policy</Label>
            <Input
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleChange}
              placeholder="e.g. 7 days return"
            />
          </div>

          {/* Offers */}
          <div>
            <Label>Available Offers</Label>
            <Input
              name="offers"
              value={formData.offers}
              onChange={handleChange}
              placeholder="e.g. 10% off, Buy 1 Get 1"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the product"
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
            />
          </div>

          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Selling price"
            />
          </div>

          {/* Quantity */}
          <div>
            <Label>Quantity</Label>
            <Input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Available quantity"
            />
          </div>

          {/* Condition */}
          <div>
            <Label>Condition</Label>
            <Select
              onValueChange={(value) => handleSelectChange("condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Option */}
          <div>
            <Label>Delivery / Pickup Option</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("deliveryOption", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup Only</SelectItem>
                <SelectItem value="delivery">Delivery Available</SelectItem>
                <SelectItem value="both">Pickup & Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image / Media */}
          <div>
            <Label>Image / Media URL</Label>
            <Input
              type="url"
              name="mediaUrl"
              value={formData.mediaUrl}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
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
            Post Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
