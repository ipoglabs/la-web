"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function BankingFinancialForm() {
  const [formData, setFormData] = useState({
    dealTitle: "",
    dealType: "",
    description: "",
    institutionName: "",
    location: "",
    interestRate: "",
    minAmount: "",
    maxAmount: "",
    tenure: "",
    eligibility: "",
    documents: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    validUntil: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Banking & Financial Deals Form</h2>

        <div className="space-y-6">
          {/* Deal Title */}
          <div className="space-y-2">
            <Label htmlFor="dealTitle">Deal / Offer Title</Label>
            <Input
              id="dealTitle"
              name="dealTitle"
              value={formData.dealTitle}
              onChange={handleChange}
              placeholder="Title of the banking or financial deal"
              required
            />
          </div>

          {/* Deal Type */}
          <div className="space-y-2">
            <Label>Deal Type</Label>
            <Select onValueChange={(value) => handleSelectChange("dealType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Deal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan">Loan</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="savings">Savings / Deposit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the deal or offer"
              rows={4}
              required
            />
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institutionName">Bank / Financial Institution</Label>
            <Input
              id="institutionName"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              placeholder="Name of the bank or financial institution"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City / Branch Location"
            />
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate / Returns</Label>
              <Input
                id="interestRate"
                name="interestRate"
                placeholder="e.g. 8% p.a."
                value={formData.interestRate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure / Duration</Label>
              <Input
                id="tenure"
                name="tenure"
                placeholder="e.g. 5 years"
                value={formData.tenure}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimum Amount</Label>
              <Input
                id="minAmount"
                name="minAmount"
                placeholder="e.g. ₹50,000"
                value={formData.minAmount}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Maximum Amount</Label>
              <Input
                id="maxAmount"
                name="maxAmount"
                placeholder="e.g. ₹10,00,000"
                value={formData.maxAmount}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-2">
            <Label htmlFor="eligibility">Eligibility Criteria</Label>
            <Textarea
              id="eligibility"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="e.g. Minimum salary ₹25,000/month, Age 21-60 years"
              rows={3}
            />
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label htmlFor="documents">Required Documents</Label>
            <Textarea
              id="documents"
              name="documents"
              value={formData.documents}
              onChange={handleChange}
              placeholder="e.g. PAN Card, Aadhaar, Salary Slip"
              rows={3}
            />
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Contact Person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Email Address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
