import type { MainCategory } from "../types";
import { listingType, bedrooms, furnishing, floorLevel } from "./shared";

export const property: MainCategory = {
  id: "property",
  label: "Property",
  description: "Find your perfect home, rental or commercial space.",
  icon: "building-2",
  iconBg: "bg-blue-100",
  iconColor: "text-blue-600",
  subcategories: [
    {
      id: "to_rent",
      label: "To Rent",
      icon: "key",
      filters: [
        {
          id: "prop_type",
          label: "Property Type",
          type: "toggle",
          options: [
            { label: "Apartment",          value: "apartment" },
            { label: "House / Villa",      value: "house"     },
            { label: "Condo",              value: "condo"     },
            { label: "Townhouse",          value: "townhouse" },
            { label: "Serviced Apartment", value: "serviced"  },
          ],
        },
        bedrooms,
        furnishing,
        floorLevel,
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",        value: "owner"   },
            { label: "Agent",        value: "agent"   },
            { label: "Helping Hand", value: "helping" },
          ],
        },
      ],
    },
    {
      id: "to_buy",
      label: "To Buy",
      icon: "building-2",
      filters: [
        {
          id: "prop_type",
          label: "Property Type",
          type: "toggle",
          options: [
            { label: "Apartment",     value: "apartment" },
            { label: "House / Villa", value: "house"     },
            { label: "Condo",         value: "condo"     },
            { label: "Townhouse",     value: "townhouse" },
            { label: "Semi-D",        value: "semid"     },
            { label: "Bungalow",      value: "bungalow"  },
          ],
        },
        bedrooms,
        floorLevel,
        {
          id: "tenure",
          label: "Tenure",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Freehold",  value: "freehold"  },
            { label: "Leasehold", value: "leasehold" },
            { label: "Any",       value: "any"       },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",   value: "owner"   },
            { label: "Agent",   value: "agent"   },
            { label: "Builder", value: "builder" },
          ],
        },
      ],
    },
    {
      id: "room_rental",
      label: "Room Rental",
      icon: "door-open",
      filters: [
        {
          id: "room_type",
          label: "Room Type",
          type: "toggle",
          options: [
            { label: "Master Room", value: "master"  },
            { label: "Single Room", value: "single"  },
            { label: "Studio",      value: "studio"  },
            { label: "En-suite",    value: "ensuite" },
            { label: "Shared",      value: "shared"  },
          ],
        },
        furnishing,
        {
          id: "gender",
          label: "Preferred Tenant",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",         value: "any"    },
            { label: "Male Only",   value: "male"   },
            { label: "Female Only", value: "female" },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",        value: "owner"   },
            { label: "Agent",        value: "agent"   },
            { label: "Helping Hand", value: "helping" },
          ],
        },
      ],
    },
    {
      id: "for_students",
      label: "For Students",
      icon: "graduation-cap",
      filters: [
        {
          id: "room_type",
          label: "Room Type",
          type: "toggle",
          options: [
            { label: "Single Room", value: "single"  },
            { label: "Studio",      value: "studio"  },
            { label: "Shared Room", value: "shared"  },
            { label: "En-suite",    value: "ensuite" },
            { label: "Hostel",      value: "hostel"  },
          ],
        },
        furnishing,
        {
          id: "gender",
          label: "Preferred Tenant",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",         value: "any"    },
            { label: "Male Only",   value: "male"   },
            { label: "Female Only", value: "female" },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",        value: "owner"   },
            { label: "Helping Hand", value: "helping" },
          ],
        },
      ],
    },
    {
      id: "commercial",
      label: "Commercial",
      icon: "landmark",
      filters: [
        listingType,
        {
          id: "commercial_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Office",        value: "office"    },
            { label: "Shop / Retail", value: "shop"      },
            { label: "Warehouse",     value: "warehouse" },
            { label: "Factory",       value: "factory"   },
            { label: "Showroom",      value: "showroom"  },
            { label: "Co-working",    value: "coworking" },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",   value: "owner"   },
            { label: "Agent",   value: "agent"   },
            { label: "Builder", value: "builder" },
          ],
        },
      ],
    },
    {
      id: "holiday_rental",
      label: "Holiday Rental",
      icon: "palm-tree",
      filters: [
        {
          id: "prop_type",
          label: "Property Type",
          type: "toggle",
          options: [
            { label: "Apartment",          value: "apartment" },
            { label: "House / Villa",      value: "house"     },
            { label: "Cottage",            value: "cottage"   },
            { label: "Cabin",              value: "cabin"     },
            { label: "Serviced Apartment", value: "serviced"  },
          ],
        },
        {
          id: "guests",
          label: "Guests",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any", value: "any"  },
            { label: "1-2", value: "1to2" },
            { label: "3-4", value: "3to4" },
            { label: "5-8", value: "5to8" },
            { label: "8+",  value: "8up"  },
          ],
        },
        {
          id: "stay_length",
          label: "Stay Length",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",     value: "any"     },
            { label: "Weekend", value: "weekend" },
            { label: "Weekly",  value: "weekly"  },
            { label: "Monthly", value: "monthly" },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",             value: "owner"   },
            { label: "Agent",              value: "agent"   },
            { label: "Property Manager",   value: "manager" },
          ],
        },
      ],
    },
    {
      id: "new_projects",
      label: "New Projects / Off-Plan",
      icon: "building",
      filters: [
        {
          id: "prop_type",
          label: "Property Type",
          type: "toggle",
          options: [
            { label: "Apartment", value: "apartment" },
            { label: "Condo",     value: "condo"     },
            { label: "Townhouse", value: "townhouse" },
            { label: "House / Villa", value: "house" },
            { label: "Commercial", value: "commercial" },
          ],
        },
        {
          id: "completion",
          label: "Completion",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",          value: "any"         },
            { label: "Ready Now",    value: "ready"       },
            { label: "< 1 Year",     value: "sub1y"       },
            { label: "1–2 Years",    value: "1to2y"       },
            { label: "2 Years+",     value: "2yup"        },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Developer", value: "developer" },
            { label: "Agent",     value: "agent"     },
          ],
        },
      ],
    },
    {
      id: "land",
      label: "Land for Sale / Lease",
      icon: "map",
      filters: [
        {
          id: "land_action",
          label: "Action",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"   },
            { label: "For Sale",  value: "sale"  },
            { label: "For Lease", value: "lease" },
          ],
        },
        {
          id: "land_type",
          label: "Land Type",
          type: "toggle",
          options: [
            { label: "Residential",  value: "residential"  },
            { label: "Commercial",   value: "commercial"   },
            { label: "Agricultural", value: "agricultural" },
            { label: "Industrial",   value: "industrial"   },
            { label: "Mixed Use",    value: "mixed"        },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",   value: "owner"   },
            { label: "Agent",   value: "agent"   },
            { label: "Builder", value: "builder" },
          ],
        },
      ],
    },
    {
      id: "wanted",
      label: "Wanted",
      icon: "search",
      filters: [
        {
          id: "wanted_type",
          label: "Looking For",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "To Rent",     value: "rent"       },
            { label: "To Buy",      value: "buy"        },
            { label: "Room Rental", value: "room"       },
            { label: "Commercial",  value: "commercial" },
            { label: "Land",        value: "land"       },
          ],
        },
        {
          id: "prop_type",
          label: "Property Type",
          type: "toggle",
          options: [
            { label: "Apartment",     value: "apartment"  },
            { label: "House / Villa", value: "house"      },
            { label: "Condo",         value: "condo"      },
            { label: "Room",          value: "room"       },
            { label: "Commercial",    value: "commercial" },
            { label: "Land",          value: "land"       },
          ],
        },
      ],
    },
  ],
};
