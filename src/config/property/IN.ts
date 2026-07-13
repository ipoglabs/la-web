import type { PropertyFormConfig } from "./types";

export const INPropertyConfig: PropertyFormConfig = {
  areaUnit: "sq ft",

  rent: {
    propertyTypes: [
      { value: "Apartment",        label: "Apartment / Flat" },
      { value: "IndependentHouse", label: "Independent House" },
      { value: "Villa",            label: "Villa" },
      { value: "Studio",           label: "Studio" },
      { value: "Other",            label: "Other" },
    ],
    furnishingOptions: [
      { value: "Furnished",      label: "Furnished" },
      { value: "Semi-furnished", label: "Semi-Furnished" },
      { value: "Unfurnished",    label: "Unfurnished" },
    ],
    amenities: [
      "Parking", "Lift", "Power Backup", "Gym", "Swimming Pool",
      "Garden", "Security", "Water Supply", "Club House", "Balcony",
    ],
  },

  buy: {
    propertyTypes: [
      { value: "Apartment",        label: "Apartment / Flat" },
      { value: "IndependentHouse", label: "Independent House" },
      { value: "Villa",            label: "Villa" },
      { value: "Plot",             label: "Plot / Land" },
      { value: "Commercial",       label: "Commercial" },
      { value: "Other",            label: "Other" },
    ],
    amenities: ["Parking", "Gym", "Swimming Pool", "Garden", "Power Backup", "Club House"],
  },

  sale: {
    propertyTypes: [
      { value: "Apartment",        label: "Apartment / Flat" },
      { value: "IndependentHouse", label: "Independent House" },
      { value: "Villa",            label: "Villa" },
      { value: "Plot",             label: "Plot / Land" },
      { value: "Commercial",       label: "Commercial" },
      { value: "Other",            label: "Other" },
    ],
    amenities: [
      "Parking", "Lift", "Power Backup", "Security", "Water Supply",
      "Balcony", "Garden", "Gym", "Swimming Pool", "Club House",
    ],
    ownershipTypes: [
      { value: "Freehold",         label: "Freehold" },
      { value: "Leasehold",        label: "Leasehold" },
      { value: "PowerOfAttorney",  label: "Power of Attorney" },
    ],
  },

  roomRental: {
    roomTypes: ["Single Room", "Shared Room", "PG", "Hostel", "Other"],
    amenities: [
      "WiFi", "Attached Bathroom", "Air Conditioning", "Kitchen Access",
      "Washing Machine", "TV/Smart TV", "Balcony", "Parking",
      "Housekeeping", "Meals Included",
    ],
  },

  commercial: {
    propertyTypes: [
      { value: "office",      label: "Office" },
      { value: "shop",        label: "Shop" },
      { value: "warehouse",   label: "Warehouse" },
      { value: "showroom",    label: "Showroom" },
      { value: "industrial",  label: "Industrial" },
      { value: "coworking",   label: "Co-working" },
    ],
    facilities: ["Parking", "Lift", "Power Backup", "Security/CCTV", "Fire Safety", "Visitor Parking"],
    amenities: ["WiFi", "Air Conditioning", "Cafeteria", "Conference Room", "Reception", "24x7 Access"],
  },

  student: {
    propertyTypes: [
      { value: "Hostel",           label: "Hostel" },
      { value: "PG",               label: "PG (Paying Guest)" },
      { value: "SharedApartment",  label: "Shared Apartment" },
      { value: "StudentApartment", label: "Student Apartment" },
      { value: "CoLiving",         label: "Co-living Space" },
    ],
    occupancyTypes: [
      { value: "Single", label: "Single" },
      { value: "Double", label: "Double Sharing" },
      { value: "Triple", label: "Triple Sharing" },
      { value: "Dorm",   label: "Dormitory" },
    ],
    facilities: [
      "WiFi", "Study Table & Chair", "Laundry Service", "Housekeeping",
      "Common Kitchen", "Meals Included", "Gym/Fitness", "Common Room",
      "Air Conditioning", "Security/CCTV", "Power Backup", "RO Water",
    ],
    amenities: ["Lift", "Parking", "Garden", "Terrace", "Balcony", "24x7 Security"],
  },

  holiday: {
    propertyTypes: [
      { value: "Villa",       label: "Villa" },
      { value: "BeachHouse",  label: "Beach House" },
      { value: "Cottage",     label: "Cottage" },
      { value: "Resort",      label: "Resort" },
      { value: "GuestHouse",  label: "Guest House" },
      { value: "FarmStay",    label: "Farm Stay" },
      { value: "Treehouse",   label: "Treehouse" },
      { value: "Other",       label: "Other" },
    ],
    amenities: [
      "WiFi", "Swimming Pool", "Air Conditioning", "Free Parking",
      "BBQ Grill", "Outdoor Dining", "Private Beach", "Kitchen",
      "Washing Machine", "TV", "Garden", "Pet Friendly",
    ],
  },

  wanted: {
    propertyTypes: [
      { value: "Apartment",        label: "Apartment / Flat" },
      { value: "IndependentHouse", label: "Independent House" },
      { value: "Villa",            label: "Villa" },
      { value: "RoomPG",           label: "Room / PG" },
      { value: "Commercial",       label: "Commercial" },
      { value: "Plot",             label: "Plot / Land" },
      { value: "Other",            label: "Other" },
    ],
    amenities: [
      "Parking", "Lift", "Power Backup", "Security", "Water Supply",
      "Balcony", "Garden", "Gym", "Swimming Pool", "Club House",
    ],
  },
};
