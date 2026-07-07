import type { PropertyFormConfig } from "./types";

export const GBPropertyConfig: PropertyFormConfig = {
  areaUnit: "sq ft",

  rent: {
    propertyTypes: [
      { value: "Flat",         label: "Flat / Apartment" },
      { value: "Terraced",     label: "Terraced House" },
      { value: "SemiDetached", label: "Semi-Detached" },
      { value: "Detached",     label: "Detached House" },
      { value: "Studio",       label: "Studio" },
      { value: "Bungalow",     label: "Bungalow" },
      { value: "Other",        label: "Other" },
    ],
    furnishingOptions: [
      { value: "Furnished",   label: "Furnished" },
      { value: "PartFurnished", label: "Part Furnished" },
      { value: "Unfurnished", label: "Unfurnished" },
    ],
    amenities: [
      "Parking", "Garden", "Garage", "Balcony",
      "Double Glazing", "Central Heating", "Security", "Pets Allowed",
    ],
  },

  buy: {
    propertyTypes: [
      { value: "Flat",         label: "Flat / Apartment" },
      { value: "Terraced",     label: "Terraced House" },
      { value: "SemiDetached", label: "Semi-Detached" },
      { value: "Detached",     label: "Detached House" },
      { value: "Bungalow",     label: "Bungalow" },
      { value: "Maisonette",   label: "Maisonette" },
      { value: "Other",        label: "Other" },
    ],
    amenities: ["Parking", "Garden", "Garage", "Balcony", "Double Glazing", "Central Heating"],
  },

  sale: {
    propertyTypes: [
      { value: "Flat",         label: "Flat / Apartment" },
      { value: "Terraced",     label: "Terraced House" },
      { value: "SemiDetached", label: "Semi-Detached" },
      { value: "Detached",     label: "Detached House" },
      { value: "Bungalow",     label: "Bungalow" },
      { value: "Maisonette",   label: "Maisonette" },
      { value: "Other",        label: "Other" },
    ],
    amenities: [
      "Parking", "Garden", "Garage", "Balcony",
      "Double Glazing", "Central Heating", "Security", "EPC Rating A/B",
    ],
    ownershipTypes: [
      { value: "Freehold",       label: "Freehold" },
      { value: "Leasehold",      label: "Leasehold" },
      { value: "SharedOwnership", label: "Shared Ownership" },
    ],
  },

  roomRental: {
    roomTypes: ["Single Room", "Double Room", "En-Suite Room", "Studio", "Other"],
    amenities: [
      "WiFi", "Bills Included", "Central Heating", "Kitchen Access",
      "Washing Machine", "TV", "Parking", "Garden", "Pets Allowed",
    ],
  },

  commercial: {
    propertyTypes: [
      { value: "office",     label: "Office" },
      { value: "retail",     label: "Retail Unit" },
      { value: "warehouse",  label: "Warehouse" },
      { value: "industrial", label: "Industrial Unit" },
      { value: "coworking",  label: "Co-working" },
      { value: "workshop",   label: "Workshop" },
    ],
    facilities: ["Parking", "Lift", "Security/CCTV", "Fire Safety", "Loading Bay", "Disabled Access"],
    amenities: ["WiFi", "Air Conditioning", "Conference Room", "Reception", "Kitchen", "24/7 Access"],
  },

  student: {
    propertyTypes: [
      { value: "StudentHalls",  label: "Student Halls" },
      { value: "SharedHouse",   label: "Shared House" },
      { value: "EnSuiteRoom",   label: "En-Suite Room" },
      { value: "StudioFlat",    label: "Studio Flat" },
      { value: "CoLiving",      label: "Co-living Space" },
    ],
    occupancyTypes: [
      { value: "Single",  label: "Single" },
      { value: "Double",  label: "Double" },
      { value: "Shared",  label: "Shared Room" },
      { value: "Studio",  label: "Studio" },
    ],
    facilities: [
      "WiFi", "Study Desk", "Laundry", "Common Kitchen",
      "Central Heating", "Security", "Bike Storage", "Common Room",
    ],
    amenities: ["Lift", "Parking", "Garden", "Games Room", "24/7 Security", "Gym"],
  },

  holiday: {
    propertyTypes: [
      { value: "Cottage",     label: "Cottage" },
      { value: "Cabin",       label: "Cabin" },
      { value: "BnB",         label: "B&B" },
      { value: "Farmhouse",   label: "Farmhouse" },
      { value: "GuestHouse",  label: "Guest House" },
      { value: "CountryHome", label: "Country Home" },
      { value: "Other",       label: "Other" },
    ],
    amenities: [
      "WiFi", "Parking", "Garden", "Fireplace", "BBQ",
      "Pet Friendly", "Kitchen", "Washing Machine", "TV",
      "Central Heating", "Hot Tub", "Children Friendly",
    ],
  },

  wanted: {
    propertyTypes: [
      { value: "Flat",         label: "Flat / Apartment" },
      { value: "Terraced",     label: "Terraced House" },
      { value: "SemiDetached", label: "Semi-Detached" },
      { value: "Detached",     label: "Detached House" },
      { value: "Room",         label: "Room" },
      { value: "Commercial",   label: "Commercial" },
      { value: "Other",        label: "Other" },
    ],
    amenities: [
      "Parking", "Garden", "Garage", "Balcony",
      "Central Heating", "Double Glazing", "Pets Allowed", "Security",
    ],
  },
};
