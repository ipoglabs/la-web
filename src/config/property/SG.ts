import type { PropertyFormConfig } from "./types";

export const SGPropertyConfig: PropertyFormConfig = {
  areaUnit: "sq ft",

  rent: {
    propertyTypes: [
      { value: "HDB",        label: "HDB Flat" },
      { value: "Condo",      label: "Condominium" },
      { value: "ExecCondo",  label: "Executive Condo" },
      { value: "Landed",     label: "Landed Property" },
      { value: "Studio",     label: "Studio" },
      { value: "Other",      label: "Other" },
    ],
    furnishingOptions: [
      { value: "Furnished",   label: "Fully Furnished" },
      { value: "Partial",     label: "Partially Furnished" },
      { value: "Unfurnished", label: "Unfurnished" },
    ],
    amenities: [
      "Parking", "Swimming Pool", "Gym", "BBQ Pit",
      "Garden", "Security", "Near MRT", "Balcony",
    ],
  },

  buy: {
    propertyTypes: [
      { value: "HDB",        label: "HDB Flat" },
      { value: "Condo",      label: "Condominium" },
      { value: "ExecCondo",  label: "Executive Condo" },
      { value: "Landed",     label: "Landed Property" },
      { value: "Shophouse",  label: "Shophouse" },
      { value: "Other",      label: "Other" },
    ],
    amenities: ["Parking", "Swimming Pool", "Gym", "BBQ Pit", "Near MRT", "Security"],
  },

  sale: {
    propertyTypes: [
      { value: "HDB",        label: "HDB Flat" },
      { value: "Condo",      label: "Condominium" },
      { value: "ExecCondo",  label: "Executive Condo" },
      { value: "Landed",     label: "Landed Property" },
      { value: "Shophouse",  label: "Shophouse" },
      { value: "Other",      label: "Other" },
    ],
    amenities: [
      "Parking", "Swimming Pool", "Gym", "BBQ Pit",
      "Security", "Near MRT", "Balcony", "Garden",
    ],
    ownershipTypes: [
      { value: "Freehold",        label: "Freehold" },
      { value: "Leasehold99",     label: "99-Year Leasehold" },
      { value: "Leasehold999",    label: "999-Year Leasehold" },
    ],
  },

  roomRental: {
    roomTypes: ["Master Room", "Common Room", "Single Room", "Entire Unit", "Other"],
    amenities: [
      "WiFi", "Air Conditioning", "Kitchen Access", "Washing Machine",
      "TV", "Parking", "Near MRT", "Cooking Allowed",
    ],
  },

  commercial: {
    propertyTypes: [
      { value: "office",      label: "Office" },
      { value: "retail",      label: "Retail Space" },
      { value: "warehouse",   label: "Warehouse" },
      { value: "industrial",  label: "Industrial" },
      { value: "coworking",   label: "Co-working" },
      { value: "shophouse",   label: "Shophouse" },
    ],
    facilities: ["Parking", "Lift", "Security/CCTV", "Fire Safety", "Visitor Parking", "Loading Bay"],
    amenities: ["WiFi", "Air Conditioning", "Conference Room", "Reception", "24x7 Access", "Cafeteria"],
  },

  student: {
    propertyTypes: [
      { value: "StudentHostel", label: "Student Hostel" },
      { value: "SharedHDB",     label: "Shared HDB" },
      { value: "CoLiving",      label: "Co-living Space" },
      { value: "ServicedRoom",  label: "Serviced Room" },
      { value: "Other",         label: "Other" },
    ],
    occupancyTypes: [
      { value: "Single",  label: "Single" },
      { value: "Double",  label: "Double Sharing" },
      { value: "Triple",  label: "Triple Sharing" },
      { value: "Dorm",    label: "Dormitory" },
    ],
    facilities: [
      "WiFi", "Study Desk", "Laundry", "Common Kitchen",
      "Air Conditioning", "Security", "Near MRT", "Gym",
    ],
    amenities: ["Lift", "Parking", "Swimming Pool", "Common Room", "24x7 Security", "Lounge"],
  },

  holiday: {
    propertyTypes: [
      { value: "ServicedApt", label: "Serviced Apartment" },
      { value: "Villa",       label: "Villa" },
      { value: "HotelRoom",   label: "Hotel Room" },
      { value: "GuestHouse",  label: "Guest House" },
      { value: "Hostel",      label: "Hostel" },
      { value: "Other",       label: "Other" },
    ],
    amenities: [
      "WiFi", "Swimming Pool", "Air Conditioning", "Free Parking",
      "BBQ Pit", "Near MRT", "Kitchen", "Washing Machine",
      "TV", "Garden", "Balcony", "Pet Friendly",
    ],
  },

  wanted: {
    propertyTypes: [
      { value: "HDB",        label: "HDB Flat" },
      { value: "Condo",      label: "Condominium" },
      { value: "Landed",     label: "Landed Property" },
      { value: "Room",       label: "Room Rental" },
      { value: "Commercial", label: "Commercial" },
      { value: "Other",      label: "Other" },
    ],
    amenities: [
      "Parking", "Swimming Pool", "Gym", "Security",
      "Near MRT", "Balcony", "BBQ Pit", "Garden",
    ],
  },
};
