import type { FilterConfig, MainCategory } from "../types";
import { conditionFull, fuelType } from "./shared";

const CURRENT_YEAR = new Date().getFullYear();

// Filters shared by the reworked Cars and Motorcycle forms. Option values
// are what the post forms save (posting/form-schema/defaults/vehicles.ts),
// matched in lib/postFilterQuery.ts. Each list covers every market —
// lib/listing-filters.ts trims and relabels it per country.
const listedBy: FilterConfig = {
  id: "listed_by",
  label: "Listed by",
  type: "toggle",
  options: [
    { label: "Owner",  value: "owner"  },
    { label: "Dealer", value: "dealer" },
  ],
};

const conditionNewUsed: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",  value: "any"  },
    { label: "New",  value: "new",  icon: "sparkles" },
    { label: "Used", value: "used", icon: "recycle"  },
  ],
};

const yearFrom: FilterConfig = {
  id: "year_from",
  label: "Year",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any", value: "any" },
    ...[1, 3, 5, 8, 10].map((age) => {
      const year = String(CURRENT_YEAR - age);
      return { label: `${year} or newer`, value: year };
    }),
  ],
};

const maxMileage: FilterConfig = {
  id: "max_mileage",
  label: "Mileage",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any", value: "any" },
    ...[10000, 25000, 50000, 75000, 100000].map((n) => ({ label: `Up to ${n.toLocaleString("en")}`, value: String(n) })),
  ],
};

const owners: FilterConfig = {
  id: "owners",
  label: "Owners",
  type: "toggle",
  options: [
    { label: "1 owner",   value: "1"      },
    { label: "2 owners",  value: "2"      },
    { label: "3 or more", value: "3plus"  },
  ],
};

const color: FilterConfig = {
  id: "color",
  label: "Color",
  type: "toggle",
  options: ["White", "Black", "Silver", "Grey", "Blue", "Red", "Brown", "Green", "Other"].map((c) => ({
    label: c,
    value: c.toLowerCase(),
  })),
};

const coeLeft: FilterConfig = {
  id: "coe_left",
  label: "COE Left",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Any",        value: "any" },
    { label: "1+ years",   value: "1"   },
    { label: "3+ years",   value: "3"   },
    { label: "5+ years",   value: "5"   },
  ],
};

export const vehicles: MainCategory = {
  id: "vehicles",
  label: "Vehicles",
  description: "Buy, sell, or rent cars, bikes and more.",
  icon: "car",
  iconBg: "bg-amber-100",
  iconColor: "text-amber-600",
  subcategories: [
    {
      id: "cars",
      label: "Cars",
      icon: "car",
      // Per market: km / miles, Saloon, ULEZ in GB, COE in SG.
      filters: [
        listedBy,
        conditionNewUsed,
        yearFrom,
        maxMileage,
        {
          id: "fuel_type",
          label: "Fuel Type",
          type: "toggle",
          options: [
            { label: "Petrol",         value: "petrol"   },
            { label: "Diesel",         value: "diesel"   },
            { label: "Hybrid",         value: "hybrid"   },
            { label: "Plug-in Hybrid", value: "phev"     },
            { label: "Electric",       value: "electric", icon: "zap" },
            { label: "CNG",            value: "cng"      },
            { label: "LPG",            value: "lpg"      },
          ],
        },
        {
          id: "transmission",
          label: "Transmission",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"       },
            { label: "Manual",    value: "manual"    },
            { label: "Automatic", value: "automatic" },
            { label: "AMT",       value: "amt"       },
          ],
        },
        {
          id: "body_type",
          label: "Body Type",
          type: "toggle",
          options: [
            { label: "SUV",         value: "suv"         },
            { label: "Sedan",       value: "sedan"       },
            { label: "Hatchback",   value: "hatchback"   },
            { label: "MUV",         value: "muv"         },
            { label: "Coupe",       value: "coupe"       },
            { label: "MPV",         value: "mpv"         },
            { label: "Estate",      value: "estate"      },
            { label: "Convertible", value: "convertible" },
            { label: "Pickup",      value: "pickup"      },
          ],
        },
        owners,
        {
          id: "seats",
          label: "Seats",
          type: "toggle",
          options: [
            { label: "2",  value: "2" },
            { label: "4",  value: "4" },
            { label: "5",  value: "5" },
            { label: "6",  value: "6" },
            { label: "7",  value: "7" },
            { label: "8+", value: "8" },
          ],
        },
        color,
        {
          id: "ulez",
          label: "ULEZ",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",            value: "any" },
            { label: "ULEZ compliant", value: "yes" },
          ],
        },
        coeLeft,
      ],
    },
    {
      id: "motorcycle",
      label: "Motorcycle",
      icon: "bike",
      // Per market: km / miles, Geared / Gearless in IN, licence classes in
      // GB and SG (worked out from cc), COE in SG.
      filters: [
        listedBy,
        {
          id: "bike_type",
          label: "Bike Type",
          type: "toggle",
          options: [
            { label: "Scooter",             value: "scooter"   },
            { label: "Commuter",            value: "commuter"  },
            { label: "Sports",              value: "sports"    },
            { label: "Cruiser",             value: "cruiser"   },
            { label: "Adventure / Touring", value: "adventure" },
            { label: "Off-road",            value: "offroad"   },
            { label: "Moped",               value: "moped"     },
          ],
        },
        conditionNewUsed,
        {
          // Values are cc ranges ("min-max", open-ended "min-").
          id: "engine_cc",
          label: "Engine Size",
          type: "toggle",
          options: [
            { label: "Up to 125cc", value: "0-125"   },
            { label: "Up to 200cc", value: "0-200"   },
            { label: "126–200cc",   value: "126-200" },
            { label: "126–500cc",   value: "126-500" },
            { label: "201–400cc",   value: "201-400" },
            { label: "Over 400cc",  value: "401-"    },
            { label: "Over 500cc",  value: "501-"    },
          ],
        },
        yearFrom,
        maxMileage,
        {
          id: "fuel_type",
          label: "Fuel Type",
          type: "toggle",
          options: [
            { label: "Petrol",   value: "petrol"   },
            { label: "Electric", value: "electric", icon: "zap" },
          ],
        },
        {
          id: "transmission",
          label: "Transmission",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"       },
            { label: "Manual",    value: "manual"    },
            { label: "Automatic", value: "automatic" },
          ],
        },
        owners,
        color,
        coeLeft,
      ],
    },
    {
      id: "van",
      label: "Van",
      icon: "truck",
      filters: [
        conditionFull,
        {
          id: "van_type",
          label: "Van Type",
          type: "toggle",
          options: [
            { label: "Cargo",        value: "cargo"        },
            { label: "Passenger",    value: "passenger"    },
            { label: "Minibus",      value: "minibus"      },
            { label: "Refrigerated", value: "refrigerated" },
          ],
        },
        {
          id: "van_seats",
          label: "Seats",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",     value: "any" },
            { label: "Up to 7", value: "s7"  },
            { label: "8-12",    value: "s12" },
            { label: "13-20",   value: "s20" },
            { label: "21+",     value: "s21" },
          ],
        },
      ],
    },
    {
      id: "truck",
      label: "Truck",
      icon: "truck",
      filters: [
        conditionFull,
        {
          id: "truck_type",
          label: "Truck Type",
          type: "toggle",
          options: [
            { label: "Pickup",  value: "pickup"  },
            { label: "Light",   value: "light"   },
            { label: "Medium",  value: "medium"  },
            { label: "Heavy",   value: "heavy"   },
            { label: "Flatbed", value: "flatbed" },
            { label: "Tipper",  value: "tipper"  },
          ],
        },
        {
          id: "payload",
          label: "Payload",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",         value: "any"   },
            { label: "< 1 tonne",   value: "sub1"  },
            { label: "1-3 tonnes",  value: "1to3"  },
            { label: "3-10 tonnes", value: "3to10" },
            { label: "10+ tonnes",  value: "10up"  },
          ],
        },
      ],
    },
    {
      id: "boats",
      label: "Boats",
      icon: "ship",
      filters: [
        conditionFull,
        {
          id: "boat_type",
          label: "Boat Type",
          type: "toggle",
          options: [
            { label: "Speedboat", value: "speedboat" },
            { label: "Sailboat",  value: "sailboat"  },
            { label: "Yacht",     value: "yacht"     },
            { label: "Fishing",   value: "fishing"   },
            { label: "Pontoon",   value: "pontoon"   },
            { label: "Jet Ski",   value: "jetski"    },
          ],
        },
        {
          id: "engine_type",
          label: "Engine",
          type: "toggle",
          options: [
            { label: "Inboard",  value: "inboard"  },
            { label: "Outboard", value: "outboard" },
            { label: "Electric", value: "electric" },
            { label: "Sail",     value: "sail"     },
          ],
        },
      ],
    },
    {
      id: "parts_accessories",
      label: "Parts & Accessories",
      icon: "settings",
      filters: [
        {
          id: "for_vehicle",
          label: "For Vehicle",
          type: "toggle",
          options: [
            { label: "Car",        value: "car"        },
            { label: "Motorcycle", value: "motorcycle" },
            { label: "Van",        value: "van"        },
            { label: "Truck",      value: "truck"      },
            { label: "Boat",       value: "boat"       },
          ],
        },
        conditionFull,
        {
          id: "part_category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Engine & Drive",  value: "engine"      },
            { label: "Body & Exterior", value: "body"        },
            { label: "Interior",        value: "interior"    },
            { label: "Tyres & Rims",    value: "tyres"       },
            { label: "Electrical",      value: "electrical"  },
            { label: "Accessories",     value: "accessories" },
          ],
        },
      ],
    },
    {
      id: "electric_vehicles",
      label: "Electric Vehicles",
      icon: "zap",
      filters: [
        {
          id: "ev_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Car",        value: "car"        },
            { label: "Motorcycle", value: "motorcycle" },
            { label: "Scooter",    value: "scooter"    },
            { label: "Van",        value: "van"        },
            { label: "Truck",      value: "truck"      },
            { label: "Other",      value: "other"      },
          ],
        },
        conditionFull,
        {
          id: "ev_range",
          label: "Range",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",      value: "any"    },
            { label: "< 150km",  value: "sub150" },
            { label: "150–300km",value: "mid"    },
            { label: "300km+",   value: "300up"  },
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
          id: "vehicle_type",
          label: "Looking For",
          type: "toggle",
          options: [
            { label: "Car",          value: "car"        },
            { label: "Motorcycle",   value: "motorcycle" },
            { label: "Van",          value: "van"        },
            { label: "Truck",        value: "truck"      },
            { label: "Boat",         value: "boat"       },
            { label: "Parts & Acc.", value: "parts"      },
          ],
        },
        conditionFull,
        fuelType,
      ],
    },
  ],
};
