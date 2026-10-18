import type { FilterConfig, MainCategory } from "../types";
import { conditionFull, fuelType } from "./shared";

const CURRENT_YEAR = new Date().getFullYear();

// Filters shared by the reworked Vehicles forms. Option values
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
      // Per market: km / miles, AMT in IN, Wheelbase and Roof Height in GB, COE in SG.
      filters: [
        listedBy,
        {
          id: "van_type",
          label: "Van Type",
          type: "toggle",
          options: [
            { label: "Panel Van",         value: "panel"        },
            { label: "Minibus",           value: "minibus"      },
            { label: "Luton / Box",       value: "luton"        },
            { label: "Crew / Double Cab", value: "crew"         },
            { label: "Pickup",            value: "pickup"       },
            { label: "Refrigerated",      value: "refrigerated" },
            { label: "Camper",            value: "camper"       },
          ],
        },
        conditionNewUsed,
        yearFrom,
        maxMileage,
        {
          id: "payload_min",
          label: "Payload",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"  },
            { label: "500 kg+",   value: "500"  },
            { label: "1,000 kg+", value: "1000" },
            { label: "1,500 kg+", value: "1500" },
            { label: "2,000 kg+", value: "2000" },
          ],
        },
        {
          id: "seats",
          label: "Seats",
          type: "toggle",
          options: [
            { label: "2",  value: "2" },
            { label: "3",  value: "3" },
            { label: "5",  value: "5" },
            { label: "6",  value: "6" },
            { label: "7",  value: "7" },
            { label: "8",  value: "8" },
            { label: "9+", value: "9" },
          ],
        },
        {
          id: "wheelbase",
          label: "Wheelbase",
          type: "toggle",
          options: [
            { label: "Short (SWB)",  value: "swb" },
            { label: "Medium (MWB)", value: "mwb" },
            { label: "Long (LWB)",   value: "lwb" },
          ],
        },
        {
          id: "roof_height",
          label: "Roof Height",
          type: "toggle",
          options: [
            { label: "Low",    value: "low"    },
            { label: "Medium", value: "medium" },
            { label: "High",   value: "high"   },
          ],
        },
        {
          id: "fuel_type",
          label: "Fuel Type",
          type: "toggle",
          options: [
            { label: "Petrol",   value: "petrol"   },
            { label: "Diesel",   value: "diesel"   },
            { label: "Hybrid",   value: "hybrid"   },
            { label: "Electric", value: "electric", icon: "zap" },
            { label: "CNG",      value: "cng"      },
            { label: "LPG",      value: "lpg"      },
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
        owners,
        color,
        coeLeft,
      ],
    },
    {
      id: "truck",
      label: "Truck",
      icon: "truck",
      // Per market: km / miles, wheels and permit in IN, BS (IN) or Euro
      // emission standards, CNG outside GB, COE in SG.
      filters: [
        listedBy,
        {
          id: "truck_type",
          label: "Body Type",
          type: "toggle",
          options: [
            { label: "Tipper",          value: "tipper"          },
            { label: "Box",             value: "box"             },
            { label: "Flatbed",         value: "flatbed"         },
            { label: "Curtainsider",    value: "curtainsider"    },
            { label: "Dropside",        value: "dropside"        },
            { label: "Refrigerated",    value: "refrigerated"    },
            { label: "Tanker",          value: "tanker"          },
            { label: "Tractor Unit",    value: "tractor"         },
            { label: "Trailer",         value: "trailer"         },
            { label: "Car Transporter", value: "car_transporter" },
          ],
        },
        conditionNewUsed,
        {
          // Values are tonne ranges ("min-max", open-ended "min-").
          id: "gvw",
          label: "Gross Weight",
          type: "toggle",
          options: [
            { label: "Up to 3.5t", value: "0-3.5"    },
            { label: "3.5–7.5t",   value: "3.51-7.5" },
            { label: "7.5–18t",    value: "7.51-18"  },
            { label: "18–26t",     value: "18.01-26" },
            { label: "Over 26t",   value: "26.01-"   },
          ],
        },
        {
          id: "payload_tonnes",
          label: "Payload",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",        value: "any" },
            { label: "1 tonne+",   value: "1"   },
            { label: "3 tonnes+",  value: "3"   },
            { label: "10 tonnes+", value: "10"  },
            { label: "20 tonnes+", value: "20"  },
          ],
        },
        {
          id: "wheels",
          label: "Wheels",
          type: "toggle",
          options: ["4", "6", "10", "12", "14", "16", "18", "22"].map((w) => ({ label: `${w} wheeler`, value: w })),
        },
        yearFrom,
        // Trucks run far more than cars: higher mileage bands, same filter id.
        {
          ...maxMileage,
          options: [
            { label: "Any", value: "any" },
            ...[100000, 250000, 500000, 750000].map((n) => ({ label: `Up to ${n.toLocaleString("en")}`, value: String(n) })),
          ],
        },
        {
          id: "fuel_type",
          label: "Fuel Type",
          type: "toggle",
          options: [
            { label: "Diesel",   value: "diesel"   },
            { label: "CNG",      value: "cng"      },
            { label: "LNG",      value: "lng"      },
            { label: "Electric", value: "electric", icon: "zap" },
          ],
        },
        {
          id: "emission",
          label: "Emission Standard",
          type: "toggle",
          options: [
            { label: "BS IV",  value: "bs4"   },
            { label: "BS VI",  value: "bs6"   },
            { label: "Euro 4", value: "euro4" },
            { label: "Euro 5", value: "euro5" },
            { label: "Euro 6", value: "euro6" },
          ],
        },
        {
          id: "cab_type",
          label: "Cab Type",
          type: "toggle",
          options: [
            { label: "Day Cab",     value: "day"     },
            { label: "Sleeper Cab", value: "sleeper" },
          ],
        },
        {
          id: "permit",
          label: "Permit",
          type: "toggle",
          options: [
            { label: "National", value: "national" },
            { label: "State",    value: "state"    },
          ],
        },
        owners,
        coeLeft,
      ],
    },
    {
      id: "boats",
      label: "Boats",
      icon: "ship",
      // Per market: Narrowboat and Mooring outside IN only where the form asks them.
      filters: [
        { ...listedBy, options: [...listedBy.options, { label: "Broker", value: "broker" }] },
        {
          id: "boat_type",
          label: "Boat Type",
          type: "toggle",
          options: [
            { label: "Motor",            value: "motor"      },
            { label: "Speedboat",        value: "speedboat"  },
            { label: "Sail",             value: "sail"       },
            { label: "Yacht",            value: "yacht"      },
            { label: "Fishing",          value: "fishing"    },
            { label: "RIB / Inflatable", value: "rib"        },
            { label: "Houseboat",        value: "houseboat"  },
            { label: "Narrowboat",       value: "narrowboat" },
            { label: "Jet Ski",          value: "jetski"     },
          ],
        },
        conditionNewUsed,
        yearFrom,
        {
          // Values are foot ranges ("min-max", open-ended "min-").
          id: "length_ft",
          label: "Length",
          type: "toggle",
          options: [
            { label: "Up to 20 ft", value: "0-20"  },
            { label: "21–30 ft",    value: "21-30" },
            { label: "31–40 ft",    value: "31-40" },
            { label: "Over 40 ft",  value: "41-"   },
          ],
        },
        {
          id: "max_engine_hours",
          label: "Engine Hours",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",             value: "any"  },
            { label: "Up to 250 hrs",   value: "250"  },
            { label: "Up to 500 hrs",   value: "500"  },
            { label: "Up to 1,000 hrs", value: "1000" },
            { label: "Up to 2,000 hrs", value: "2000" },
          ],
        },
        {
          id: "hull",
          label: "Hull Material",
          type: "toggle",
          options: [
            { label: "GRP / Fibreglass", value: "grp"        },
            { label: "Aluminium",        value: "aluminium"  },
            { label: "Steel",            value: "steel"      },
            { label: "Wood",             value: "wood"       },
            { label: "Inflatable",       value: "inflatable" },
          ],
        },
        {
          id: "engine_type",
          label: "Engine",
          type: "toggle",
          options: [
            { label: "Inboard",    value: "inboard"    },
            { label: "Outboard",   value: "outboard"   },
            { label: "Sterndrive", value: "sterndrive" },
            { label: "Jet",        value: "jet"        },
            { label: "None",       value: "none"       },
          ],
        },
        {
          id: "fuel_type",
          label: "Fuel Type",
          type: "toggle",
          options: [
            { label: "Petrol",   value: "petrol"   },
            { label: "Diesel",   value: "diesel"   },
            { label: "Electric", value: "electric", icon: "zap" },
          ],
        },
        {
          id: "berths_min",
          label: "Berths",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any", value: "any" },
            { label: "1+",  value: "1"   },
            { label: "2+",  value: "2"   },
            { label: "4+",  value: "4"   },
            { label: "6+",  value: "6"   },
          ],
        },
        {
          id: "trailer",
          label: "Trailer",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",              value: "any" },
            { label: "Trailer included", value: "yes" },
          ],
        },
        {
          id: "mooring",
          label: "Mooring",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",              value: "any" },
            { label: "Mooring included", value: "yes" },
          ],
        },
      ],
    },
    {
      id: "parts_accessories",
      label: "Parts & Accessories",
      icon: "settings",
      // Same in every market. A vehicle type also finds Universal parts.
      filters: [
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Private", value: "private" },
            { label: "Trade",   value: "trade"   },
          ],
        },
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
        {
          id: "part_category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Engine & Transmission", value: "engine"      },
            { label: "Brakes & Suspension",   value: "brakes"      },
            { label: "Electrical & Lighting", value: "electrical"  },
            { label: "Body & Exterior",       value: "exterior"    },
            { label: "Interior",              value: "interior"    },
            { label: "Wheels & Tyres",        value: "tyres"       },
            { label: "Audio & Electronics",   value: "audio"       },
            { label: "Accessories",           value: "accessories" },
            { label: "Tools",                 value: "tools"       },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",                     value: "any"         },
            { label: "New",                     value: "new",         icon: "sparkles" },
            { label: "Used",                    value: "used",        icon: "recycle"  },
            { label: "Refurbished",             value: "refurbished" },
            { label: "For Parts / Not Working", value: "for_parts"   },
          ],
        },
        {
          id: "origin",
          label: "Genuine or Aftermarket",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",           value: "any"         },
            { label: "Genuine (OEM)", value: "genuine"     },
            { label: "Aftermarket",   value: "aftermarket" },
          ],
        },
        {
          id: "delivery",
          label: "Delivery",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",                value: "any" },
            { label: "Delivery available", value: "yes" },
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
