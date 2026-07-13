export interface Option {
  value: string;
  label: string;
}

export interface PropertyFormConfig {
  areaUnit: string;   // "sq ft" | "sq m"

  // ── Per-form options ──────────────────────────────────────────────────────
  rent: {
    propertyTypes: Option[];
    furnishingOptions: Option[];
    amenities: string[];
  };

  buy: {
    propertyTypes: Option[];
    amenities: string[];
  };

  sale: {
    propertyTypes: Option[];
    amenities: string[];
    ownershipTypes: Option[];
  };

  roomRental: {
    roomTypes: string[];
    amenities: string[];
  };

  commercial: {
    propertyTypes: Option[];
    facilities: string[];
    amenities: string[];
  };

  student: {
    propertyTypes: Option[];
    occupancyTypes: Option[];
    facilities: string[];
    amenities: string[];
  };

  holiday: {
    propertyTypes: Option[];
    amenities: string[];
  };

  wanted: {
    propertyTypes: Option[];
    amenities: string[];
  };
}
