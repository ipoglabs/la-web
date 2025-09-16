"use client";

import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
// If you already use a shared contact section like in Commercial, keep this:
// import ContactDetailsSection from "@/app/components/form/ContactDetailsSection";

export default function PropertySaleForm() {
  const amenitiesOptions = [
    "Parking",
    "Lift",
    "Power Backup",
    "Security",
    "Water Supply",
    "Balcony",
    "Garden",
    "Gym",
    "Swimming Pool",
    "Club House",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Add Property for Sale</h2>

      {/* Property Type */}
      <SelectField
        label="Property Type"
        field="propertyType"
        options={[
          { value: "Apartment", label: "Apartment" },
          { value: "IndependentHouse", label: "Independent House" },
          { value: "Villa", label: "Villa" },
          { value: "Plot", label: "Plot / Land" },
          { value: "Commercial", label: "Commercial" },
          { value: "Other", label: "Other" },
        ]}
        required
      />

      {/* Basic */}
      <FormField
        label="Listing Title"
        field="name"
        placeholder="e.g. 3BHK Apartment in Anna Nagar"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the property, highlights, and nearby amenities"
      />

      {/* Pricing */}
      <FormField
        label="Expected Price (₹)"
        field="salePrice"
        type="number"
        placeholder="e.g. 9500000"
        required
      />

      {/* Optional flags */}
      <SelectField
        label="Price Negotiable"
        field="negotiable"
        options={[{ value: "Yes" }, { value: "No" }]}
      />

      {/* Size */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Built-up Area (sq.ft.)" field="builtup_area" type="number" />
        <FormField label="Carpet Area (sq.ft.)" field="carpet_area" type="number" />
        <FormField label="Plot Area (sq.ft.)" field="plot_area" type="number" />
      </div>

      {/* Beds / Baths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Bedrooms" field="beds" type="number" />
        <FormField label="Bathrooms" field="baths" type="number" />
      </div>

      {/* Ownership / Age */}
      <SelectField
        label="Ownership Type"
        field="ownership"
        options={[
          { value: "Freehold" },
          { value: "Leasehold" },
          { value: "Co-operative Society" },
          { value: "Power of Attorney" },
        ]}
      />
      <SelectField
        label="Age of Property"
        field="age"
        options={[
          { value: "New" },
          { value: "Under Construction" },
          { value: "0-1 years" },
          { value: "1-5 years" },
          { value: "5-10 years" },
          { value: "10+ years" },
        ]}
      />

      {/* Amenities */}
      <CheckboxGroupField
        label="Amenities"
        field="amenities"
        options={amenitiesOptions}
        cols={3}
      />

      {/* Optional shared contact section */}
      {/* <ContactDetailsSection /> */}
    </div>
  );
}
