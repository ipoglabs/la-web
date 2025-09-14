// ForStudentForm.tsx
"use client";

import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ForStudentForm() {
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);
  const setField = usePostFormStore((s) => s.setField);

  const facilitiesOptions = [
    "WiFi",
    "Study Table & Chair",
    "Laundry Service",
    "Housekeeping",
    "Common Kitchen",
    "Meals Included",
    "Gym/Fitness",
    "Common Room",
    "Air Conditioning",
    "Security/CCTV",
    "Power Backup",
    "RO Water",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Add Student Property</h2>

      <SelectField
        label="Property Type"
        field="propertyType"
        options={[
          { value: "Hostel" },
          { value: "PG" },
          { value: "SharedApartment", label: "Shared Apartment" },
          { value: "StudentApartment", label: "Student Apartment" },
          { value: "CoLiving", label: "Co-living Space" },
        ]}
      />

      <FormField label="Listing Title" field="name" placeholder="e.g. Boys PG near XYZ University" required />
      <FormField label="Description" field="description" type="textarea" placeholder="Describe the property…" />

      <SelectField
        label="Occupancy Type"
        field="occupancy"
        options={[
          { value: "Single" },
          { value: "Double", label: "Double Sharing" },
          { value: "Triple", label: "Triple Sharing" },
          { value: "Dorm", label: "Dormitory" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Beds" field="beds" type="number" required />
        <FormField label="Baths" field="baths" type="number" required />
      </div>

      <SelectField
        label="Gender Preference"
        field="gender_pref"
        options={[{ value: "Boys" }, { value: "Girls" }, { value: "CoEd", label: "Co-ed" }]}
      />

      {/* ✅ bind to "facilities" */}
      <CheckboxGroupField label="Facilities" field="facilities" options={facilitiesOptions} cols={3} />

      <div className="bg-blue-50 p-4 rounded-xl space-y-4">
        <h4 className="font-medium">Pricing</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <FormField label="Monthly Rent (per bed)" field="rentPrice" type="number" />
          <FormField label="Security Deposit" field="deposit" type="number" />
        </div>
      </div>

      {/* // ForStudentForm.tsx (contact details section) */}
<div className="space-y-2">
  <label className="text-sm font-medium">Contact Name</label>
  <input
    className="w-full border rounded px-3 py-2"
    placeholder="Owner/Manager Name"
    value={sellerInfo.name}
    onChange={(e) =>
      setField("sellerInfo", { ...sellerInfo, name: e.target.value })
    }
  />
</div>

<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <input
    className="w-full border rounded px-3 py-2"
    type="email"
    placeholder="Email address"
    value={sellerInfo.email}
    onChange={(e) =>
      setField("sellerInfo", { ...sellerInfo, email: e.target.value })
    }
  />
</div>

<div className="space-y-2">
  <label className="text-sm font-medium">Phone</label>
  <input
    className="w-full border rounded px-3 py-2"
    type="tel"
    placeholder="Phone number"
    value={sellerInfo.phone}
    onChange={(e) =>
      setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
    }
  />
</div>

    </div>
  );
}
