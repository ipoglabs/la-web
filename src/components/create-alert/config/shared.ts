/**
 * shared.ts — reusable FilterConfig constants used across multiple categories.
 * Import only what you need in each category file.
 */
import type { FilterConfig } from "../types";

export const listingType: FilterConfig = {
  id: "listing_type",
  label: "Listing",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",      value: "any"  },
    { label: "For Rent", value: "rent" },
    { label: "For Sale", value: "sale" },
  ],
};

export const conditionFull: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",       value: "any"       },
    { label: "New",       value: "new",       icon: "sparkles" },
    { label: "Like New",  value: "like_new"  },
    { label: "Used",      value: "used",      icon: "recycle"  },
    { label: "For Parts", value: "for_parts" },
  ],
};

export const fuelType: FilterConfig = {
  id: "fuel_type",
  label: "Fuel Type",
  type: "toggle",
  options: [
    { label: "Petrol",   value: "petrol"   },
    { label: "Diesel",   value: "diesel"   },
    { label: "Hybrid",   value: "hybrid"   },
    { label: "Electric", value: "electric", icon: "zap" },
    { label: "CNG",      value: "cng"      },
  ],
};

export const field: FilterConfig = {
  id: "field",
  label: "Field",
  type: "toggle",
  options: [
    { label: "IT & Tech",    value: "it"          },
    { label: "Finance",      value: "finance"     },
    { label: "Sales & Mktg", value: "sales"       },
    { label: "Engineering",  value: "engineering" },
    { label: "Healthcare",   value: "healthcare"  },
    { label: "Education",    value: "education"   },
    { label: "Admin & Ops",  value: "admin"       },
    { label: "Creative",     value: "creative"    },
    { label: "Hospitality",  value: "hospitality" },
  ],
};

export const workArrangement: FilterConfig = {
  id: "work_arrangement",
  label: "Work Arrangement",
  type: "toggle",
  options: [
    { label: "On-site", value: "onsite"               },
    { label: "Hybrid",  value: "hybrid"               },
    { label: "Remote",  value: "remote", icon: "laptop" },
  ],
};

export const experience: FilterConfig = {
  id: "experience",
  label: "Experience Level",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",     value: "any"     },
    { label: "Entry",   value: "entry"   },
    { label: "Mid",     value: "mid"     },
    { label: "Senior",  value: "senior"  },
    { label: "Lead",    value: "lead"    },
    { label: "Manager", value: "manager" },
  ],
};

export const bedrooms: FilterConfig = {
  id: "bedrooms",
  label: "Bedrooms",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",    value: "any"    },
    { label: "Studio", value: "studio" },
    { label: "1 BR",   value: "1br"    },
    { label: "2 BR",   value: "2br"    },
    { label: "3 BR",   value: "3br"    },
    { label: "4 BR",   value: "4br"    },
    { label: "5+ BR",  value: "5br"    },
  ],
};

export const furnishing: FilterConfig = {
  id: "furnishing",
  label: "Furnishing",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",         value: "any"         },
    { label: "Furnished",   value: "furnished"   },
    { label: "Unfurnished", value: "unfurnished" },
    { label: "Partial",     value: "partial"     },
  ],
};

export const floorLevel: FilterConfig = {
  id: "floor_level",
  label: "Floor Level",
  type: "toggle",
  options: [
    { label: "Any",    value: "any"    },
    { label: "Ground", value: "ground" },
    { label: "Low",    value: "low"    },
    { label: "Mid",    value: "mid"    },
    { label: "High",   value: "high"   },
  ],
};

export const serviceMode: FilterConfig = {
  id: "service_mode",
  label: "How",
  type: "toggle",
  options: [
    { label: "In-person",  value: "inperson"              },
    { label: "Home Visit", value: "homevisit"             },
    { label: "Online",     value: "online", icon: "laptop" },
  ],
};

export const discount: FilterConfig = {
  id: "discount",
  label: "Min Discount",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any deal", value: "any" },
    { label: "10%+",     value: "10"  },
    { label: "20%+",     value: "20"  },
    { label: "30%+",     value: "30"  },
    { label: "50%+",     value: "50"  },
  ],
};

export const dealType: FilterConfig = {
  id: "deal_type",
  label: "Deal Type",
  type: "toggle",
  options: [
    { label: "% Off",       value: "pct_off"  },
    { label: "Buy 1 Get 1", value: "bogo"     },
    { label: "Bundle",      value: "bundle"   },
    { label: "Flash Sale",  value: "flash"    },
    { label: "Cashback",    value: "cashback" },
    { label: "Voucher",     value: "voucher"  },
    { label: "Free Gift",   value: "free_gift"},
  ],
};

export const redemption: FilterConfig = {
  id: "redemption",
  label: "Redeem At",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "In-store", value: "instore" },
    { label: "Online",   value: "online"  },
    { label: "Both",     value: "both"    },
  ],
};
