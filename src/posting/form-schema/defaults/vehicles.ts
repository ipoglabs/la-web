// Default "Vehicles" post-form schemas.

import { getVehicleConfig, type VehicleFormConfig } from "@/config/vehicle";
import { IN_REGISTRATION_STATES } from "@/config/vehicle/IN";
import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs } from "./shared";

const vehicleCondition = pairs([
  ["new", "New"],
  ["used", "Used"],
  ["refurbished", "Refurbished"],
]);
const transmission = pairs([
  ["manual", "Manual"],
  ["automatic", "Automatic"],
  ["amt", "AMT"],
]);
const serviceHistory = pairs([
  ["full", "Full"],
  ["partial", "Partial"],
  ["none", "None"],
]);

const makeModel = (required: boolean): FormFieldDef[] => [
  { key: "make", type: "text", label: "Make", required, width: "half" },
  { key: "model", type: "text", label: "Model", required, width: "half" },
];

const price: FormFieldDef = { key: "salePrice", type: "currency", label: "Price", required: true, min: 1 };

// ── Reworked per market: every Vehicles subcategory ──────────────────────────
// From the Vehicles post form reviews (2026-10-18): GB mileage in miles with
// an MOT, SG COE details, IN registering state instead of the plate. The
// other subcategories still share makeModel / paperwork.

// Same stored "Yes" / "No" as Property's Negotiable.
const YES_NO_TEXT = opts(["Yes", "No"]);
const VEHICLE_COLORS = opts(["White", "Black", "Silver", "Grey", "Blue", "Red", "Brown", "Green", "Other"]);
const listedBy: FormFieldDef = { key: "listedBy", type: "select", label: "Listed By", required: true, options: opts(["Owner", "Dealer"]) };
const negotiable: FormFieldDef = { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO_TEXT, defaultValue: "No", width: "half" };

/** Make from the market's list (Other asks for it), then Model as text. */
const makeModelPicked = (makes: string[]): FormFieldDef[] => [
  { key: "make", type: "select", display: "dropdown", label: "Make", required: true, options: opts([...makes, "Other"]), width: "half" },
  { key: "makeOther", type: "text", label: "Other Make", required: true, width: "half", showWhen: { field: "make", in: ["Other"] } },
  { key: "model", type: "text", label: "Model", required: true, width: "half" },
];

/** KMs Driven, or Mileage in miles in GB — same `kms` key. */
const distance = (country: string): FormFieldDef =>
  country === "GB"
    ? { key: "kms", type: "number", label: "Mileage", unit: "miles", min: 0, width: "half" }
    : { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" };

/** UK insurers' write-off categories; AutoTrader shows them and lets buyers exclude them. */
const WRITE_OFF = pairs([
  ["none", "Not a write-off"],
  ["S", "Cat S (structural damage)"],
  ["N", "Cat N (non-structural damage)"],
]);
/** Indian policies: CarDekho and Cars24 show the cover beside its validity. */
const INSURANCE_TYPE = pairs([
  ["comprehensive", "Comprehensive"],
  ["zero_dep", "Zero Depreciation"],
  ["third_party", "Third Party"],
  ["expired", "Expired"],
]);
/** Taking the buyer's old vehicle in part payment, in each market's words. */
const PART_EXCHANGE_LABEL: Record<string, string> = { IN: "Exchange Accepted", GB: "Part Exchange Considered", SG: "Trade-in Considered" };

/**
 * The History section per market. GB keeps the plate (buyers run a history
 * check) and adds MOT Expiry; SG drops the plate for COE Expiry; IN asks
 * the registering state instead of the plate. `extra` goes before Service
 * History (Cars: ULEZ in GB, registration date and depreciation in SG).
 * Every market ends with Part Exchange; GB asks the write-off category and
 * IN the insurance cover.
 */
function historyFields(
  country: string,
  extra: { GB?: FormFieldDef[]; SG?: FormFieldDef[]; motLabel?: string } = {},
): FormFieldDef[] {
  const serviceHistoryField: FormFieldDef = { key: "serviceHistory", type: "select", label: "Service History", options: serviceHistory };
  const partExchange: FormFieldDef = {
    key: "partExchange",
    type: "select",
    label: PART_EXCHANGE_LABEL[country] ?? PART_EXCHANGE_LABEL.IN,
    options: YES_NO_TEXT,
    width: "half",
  };
  if (country === "GB") {
    return [
      { key: "ownerType", type: "select", label: "Previous Owners", options: opts(["1", "2", "3", "4+"]) },
      { key: "registrationNumber", type: "text", label: "Registration Number", width: "half" },
      { key: "motExpiry", type: "date", label: extra.motLabel ?? "MOT Expiry", width: "half" },
      { key: "writeOff", type: "select", label: "Write-off Category", options: WRITE_OFF, hint: "Shown on the vehicle's insurance history check." },
      ...(extra.GB ?? []),
      serviceHistoryField,
      partExchange,
    ];
  }
  if (country === "SG") {
    return [
      { key: "ownerType", type: "select", label: "No. of Owners", options: opts(["1", "2", "3+"]) },
      { key: "coeExpiry", type: "date", label: "COE Expiry", required: true, width: "half" },
      ...(extra.SG ?? []),
      serviceHistoryField,
      partExchange,
    ];
  }
  return [
    { key: "ownerType", type: "select", label: "Owner Type", options: opts(["First Owner", "Second Owner", "Third Owner or more"]) },
    { key: "registrationState", type: "select", display: "dropdown", label: "Registration State (RTO)", options: opts(IN_REGISTRATION_STATES), width: "half" },
    { key: "insuranceValidTill", type: "date", label: "Insurance Valid Till", width: "half" },
    { key: "insuranceType", type: "select", label: "Insurance Type", options: INSURANCE_TYPE, width: "half" },
    serviceHistoryField,
    partExchange,
  ];
}
// Saved as a number (8 = "8+").
const CAR_SEATS = [
  ...["2", "4", "5", "6", "7"].map((v) => ({ value: v, label: v })),
  { value: "8", label: "8+" },
];

/** Cars body types; GB says Saloon (stored as Sedan everywhere), MUV is Indian. */
const carBodyTypes = (country: string) =>
  opts(["SUV", "Sedan", "Hatchback", ...(country === "IN" ? ["MUV"] : []), "Coupe", "MPV", "Estate", "Convertible", "Pickup"]).map((o) =>
    country === "GB" && o.value === "Sedan" ? { ...o, label: "Saloon" } : o,
  );

function carsSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  const india = country === "IN";

  const bodyType = carBodyTypes(country);

  return [
    basics,
    {
      title: "Vehicle",
      fields: [
        listedBy,
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        ...makeModelPicked(c.carMakes),
        { key: "year", type: "number", label: "Year", required: true, width: "half" },
        distance(country),
        gb
          ? { key: "engineCapacity", type: "number", label: "Engine Size", unit: "litres", min: 0.5, width: "half" }
          : { key: "engineCapacity", type: "number", label: "Engine Size", unit: "cc", min: 50, width: "half" },
        { key: "fuelType", type: "select", label: "Fuel Type", options: [...c.carFuelTypes, { value: "phev", label: "Plug-in Hybrid" }] },
        // AMT (automated manual) is an Indian term.
        { key: "transmission", type: "select", label: "Transmission", options: india ? transmission : transmission.slice(0, 2) },
        { key: "bodyType", type: "select", label: "Body Type", options: bodyType },
        { key: "color", type: "select", label: "Color", options: VEHICLE_COLORS },
        { key: "seatingCapacity", type: "select", label: "Seats", options: CAR_SEATS },
        { ...price, width: "half" },
        negotiable,
      ],
    },
    {
      title: "History",
      fields: historyFields(country, {
        GB: [{ key: "ulezCompliant", type: "select", label: "ULEZ Compliant", options: YES_NO_TEXT }],
        SG: [
          { key: "registrationDate", type: "date", label: "Registration Date", width: "half" },
          { key: "depreciationPerYear", type: "currency", label: "Depreciation per Year", unit: "/ year", min: 0, width: "half" },
        ],
      }),
    },
  ];
}

// Saved as slugs; search filters on them (lib/postFilterQuery.ts).
const BIKE_TYPES = pairs([
  ["scooter", "Scooter"],
  ["commuter", "Commuter"],
  ["sports", "Sports"],
  ["cruiser", "Cruiser"],
  ["adventure", "Adventure / Touring"],
  ["offroad", "Off-road"],
  ["moped", "Moped"],
]);

function motorcycleSections(country: string, c: VehicleFormConfig): FormSection[] {
  return [
    basics,
    {
      title: "Vehicle",
      fields: [
        listedBy,
        { key: "bikeType", type: "select", label: "Bike Type", required: true, options: BIKE_TYPES },
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        ...makeModelPicked(c.motorcycleMakes),
        { key: "year", type: "number", label: "Year", required: true, width: "half" },
        distance(country),
        { key: "engineCapacity", type: "number", label: "Engine Capacity", unit: "cc", min: 1, width: "half" },
        // Hybrid motorbikes are almost unknown — the option invited mistakes.
        { key: "fuelType", type: "select", label: "Fuel Type", options: pairs([["petrol", "Petrol"], ["electric", "Electric"]]) },
        // Indian buyers say geared / gearless; same stored values.
        {
          key: "transmission",
          type: "select",
          label: "Transmission",
          options: country === "IN" ? pairs([["manual", "Geared"], ["automatic", "Gearless (scooter)"]]) : transmission.slice(0, 2),
        },
        { key: "color", type: "select", label: "Color", options: VEHICLE_COLORS },
        { ...price, width: "half" },
        negotiable,
      ],
    },
    { title: "History", fields: historyFields(country) },
  ];
}

// Saved as slugs; search filters on them (lib/postFilterQuery.ts).
const VAN_TYPES = pairs([
  ["panel", "Panel Van"],
  ["minibus", "Minibus"],
  ["luton", "Luton / Box"],
  ["crew", "Crew / Double Cab"],
  ["pickup", "Pickup"],
  ["refrigerated", "Refrigerated"],
  ["camper", "Camper"],
]);
// Saved as a number (9 = "9+").
const VAN_SEATS = [
  ...["2", "3", "5", "6", "7", "8"].map((v) => ({ value: v, label: v })),
  { value: "9", label: "9+" },
];

function vanSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  return [
    basics,
    {
      title: "Vehicle",
      fields: [
        listedBy,
        { key: "vanType", type: "select", label: "Van Type", required: true, options: VAN_TYPES },
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        ...makeModelPicked(c.vanMakes),
        { key: "year", type: "number", label: "Year", required: true, width: "half" },
        distance(country),
        { key: "payload", type: "number", label: "Payload", unit: "kg", min: 0, max: 50_000, width: "half" },
        { key: "seatingCapacity", type: "select", label: "Seats", options: VAN_SEATS },
        // Standard GB van sizes.
        ...(gb
          ? ([
              { key: "wheelbase", type: "select", label: "Wheelbase", options: pairs([["swb", "Short (SWB)"], ["mwb", "Medium (MWB)"], ["lwb", "Long (LWB)"]]) },
              { key: "roofHeight", type: "select", label: "Roof Height", options: pairs([["low", "Low"], ["medium", "Medium"], ["high", "High"]]) },
            ] satisfies FormFieldDef[])
          : []),
        { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes },
        // AMT (automated manual) is an Indian term.
        { key: "transmission", type: "select", label: "Transmission", options: country === "IN" ? transmission : transmission.slice(0, 2) },
        { key: "color", type: "select", label: "Color", options: VEHICLE_COLORS },
        { ...price, width: "half" },
        negotiable,
        // GB trade vans are priced "+VAT", which adds 20%.
        ...(gb
          ? ([{ key: "priceIncludesVat", type: "select", label: "Price Includes VAT", required: true, options: pairs([["yes", "Yes"], ["no", "No (+VAT)"]]) }] satisfies FormFieldDef[])
          : []),
      ],
    },
    { title: "History", fields: historyFields(country) },
  ];
}

// Saved as slugs; search filters on them (lib/postFilterQuery.ts).
const TRUCK_BODY_TYPES = pairs([
  ["tipper", "Tipper"],
  ["box", "Box"],
  ["flatbed", "Flatbed"],
  ["curtainsider", "Curtainsider"],
  ["dropside", "Dropside"],
  ["refrigerated", "Refrigerated"],
  ["tanker", "Tanker"],
  ["tractor", "Tractor Unit"],
  ["trailer", "Trailer"],
  ["car_transporter", "Car Transporter"],
  ["other", "Other"],
]);
// GB trucks are sold and licensed by gross weight class (tonnes).
const GB_GVW_CLASSES = ["3.5", "7.5", "12", "18", "26", "32", "44"];

function truckSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  const india = country === "IN";
  return [
    basics,
    {
      title: "Vehicle",
      fields: [
        listedBy,
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        ...makeModelPicked(c.truckMakes),
        { key: "year", type: "number", label: "Year", required: true, width: "half" },
        distance(country),
        { key: "bodyType", type: "select", label: "Body Type", options: TRUCK_BODY_TYPES },
        // Indian buyers search by wheels ("10 wheeler"), not axle config.
        ...(india
          ? ([
              { key: "wheels", type: "select", label: "Number of Wheels", required: true, options: opts(["4", "6", "10", "12", "14", "16", "18", "22"]) },
            ] satisfies FormFieldDef[])
          : []),
        { key: "axleConfig", type: "select", label: "Axle Config", options: opts(["4x2", "6x2", "6x4", "8x2", "8x4"]) },
        { key: "payloadCapacity", type: "number", label: "Payload", unit: "tonnes", min: 0, max: 100, width: "half" },
        // Same `gvwr` key everywhere, in tonnes; GB picks its weight class.
        gb
          ? { key: "gvwr", type: "select", label: "Gross Vehicle Weight", options: GB_GVW_CLASSES.map((t) => ({ value: t, label: `${t}t` })) }
          : { key: "gvwr", type: "number", label: "Gross Vehicle Weight", unit: "tonnes", min: 0, max: 100, width: "half" },
        { key: "cabType", type: "select", label: "Cab Type", options: pairs([["day", "Day Cab"], ["sleeper", "Sleeper Cab"]]) },
        {
          key: "emissionStandard",
          type: "select",
          label: "Emission Standard",
          options: india ? pairs([["bs4", "BS IV"], ["bs6", "BS VI"]]) : pairs([["euro4", "Euro 4"], ["euro5", "Euro 5"], ["euro6", "Euro 6"]]),
        },
        ...(india
          ? ([{ key: "permitType", type: "select", label: "Permit Type", options: pairs([["national", "National"], ["state", "State"], ["none", "None"]]) }] satisfies FormFieldDef[])
          : []),
        // Petrol and hybrid trucks are rare; GB has almost no CNG trucks.
        {
          key: "fuelType",
          type: "select",
          label: "Fuel Type",
          options: pairs([["diesel", "Diesel"], ...(gb ? [] : ([["cng", "CNG"]] as [string, string][])), ["lng", "LNG"], ["electric", "Electric"]]),
        },
        { key: "transmission", type: "select", label: "Transmission", options: transmission },
        { ...price, width: "half" },
        negotiable,
        // GB trade trucks are priced "+VAT", which adds 20%.
        ...(gb
          ? ([{ key: "priceIncludesVat", type: "select", label: "Price Includes VAT", required: true, options: pairs([["yes", "Yes"], ["no", "No (+VAT)"]]) }] satisfies FormFieldDef[])
          : []),
      ],
    },
    // GB trucks have a yearly roadworthiness test instead of an MOT.
    { title: "History", fields: historyFields(country, { motLabel: "Annual Test Expiry" }) },
  ];
}

function boatsSections(country: string): FormSection[] {
  const gb = country === "GB";
  return [
    basics,
    {
      title: "Boat",
      fields: [
        // Boats are often sold through brokers.
        { key: "listedBy", type: "select", label: "Listed By", required: true, options: opts(["Owner", "Broker", "Dealer"]) },
        {
          key: "boatType",
          type: "select",
          label: "Boat Type",
          required: true,
          options: pairs([
            ["motor", "Motor"],
            ["speedboat", "Speedboat"],
            ["sail", "Sail"],
            ["yacht", "Yacht"],
            ["fishing", "Fishing"],
            ["rib", "RIB / Inflatable"],
            ["houseboat", "Houseboat"],
            // GB canal boats.
            ...(gb ? ([["narrowboat", "Narrowboat"]] as [string, string][]) : []),
            ["jetski", "Jet Ski"],
            ["other", "Other"],
          ]),
        },
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        ...makeModel(false),
        { key: "year", type: "number", label: "Year", width: "half" },
        { key: "lengthFt", type: "number", label: "Length", unit: "ft", min: 1, max: 1000, width: "half" },
        { key: "hullMaterial", type: "select", label: "Hull Material", options: pairs([["grp", "GRP / Fibreglass"], ["aluminium", "Aluminium"], ["steel", "Steel"], ["wood", "Wood"], ["inflatable", "Inflatable"]]) },
        { key: "engineType", type: "select", label: "Engine Type", options: pairs([["inboard", "Inboard"], ["outboard", "Outboard"], ["sterndrive", "Sterndrive"], ["jet", "Jet"], ["none", "None"]]) },
        { key: "fuelType", type: "select", label: "Fuel Type", options: pairs([["petrol", "Petrol"], ["diesel", "Diesel"], ["electric", "Electric"], ["none", "None"]]) },
        // A used boat's main wear figure, as mileage is for a car.
        { key: "engineHours", type: "number", label: "Engine Hours", unit: "hrs", min: 0, max: 100_000, width: "half" },
        { key: "enginePower", type: "number", label: "Engine Power", unit: "hp", min: 0, max: 10_000, width: "half" },
        { key: "berths", type: "number", label: "Berths", min: 0, max: 50, width: "half" },
        { key: "maxPassengers", type: "number", label: "Max Passengers", min: 1, max: 500, width: "half" },
        { key: "trailerIncluded", type: "select", label: "Trailer Included", options: YES_NO_TEXT },
        // A transferable mooring adds real value; GB and SG boats are often sold with one.
        ...(country === "IN" ? [] : ([{ key: "mooringIncluded", type: "select", label: "Mooring Included", options: YES_NO_TEXT }] satisfies FormFieldDef[])),
        { ...price, width: "half" },
        negotiable,
        ...(gb ? ([{ key: "vatPaid", type: "select", label: "VAT Paid", options: YES_NO_TEXT }] satisfies FormFieldDef[]) : []),
      ],
    },
  ];
}

// Older posts saved engine / electrical / interior / exterior / tyres /
// others — those values are kept, under their wider labels.
const PARTS_CATEGORIES = pairs([
  ["engine", "Engine & Transmission"],
  ["brakes", "Brakes & Suspension"],
  ["electrical", "Electrical & Lighting"],
  ["exterior", "Body & Exterior"],
  ["interior", "Interior"],
  ["tyres", "Wheels & Tyres"],
  ["audio", "Audio & Electronics"],
  ["accessories", "Accessories"],
  ["tools", "Tools"],
  ["others", "Other"],
]);

const partsSections: FormSection[] = [
  basics,
  {
    title: "Part",
    fields: [
      // Breakers and parts shops are a big share of sellers.
      { key: "listedBy", type: "select", label: "Listed By", required: true, options: opts(["Private", "Trade"]) },
      {
        key: "forVehicle",
        type: "select",
        label: "For Vehicle Type",
        required: true,
        options: pairs([["car", "Car"], ["motorcycle", "Motorcycle"], ["van", "Van"], ["truck", "Truck"], ["boat", "Boat"], ["universal", "Universal"]]),
      },
      { key: "partsCategory", type: "select", label: "Parts Category", required: true, options: PARTS_CATEGORIES },
      { key: "tyreSize", type: "text", label: "Tyre Size", placeholder: "e.g. 205/55 R16", width: "half", showWhen: { field: "partsCategory", in: ["tyres"] } },
      { key: "brand", type: "text", label: "Brand", width: "half" },
      { key: "partNumber", type: "text", label: "Part Number", width: "half" },
      { key: "partOrigin", type: "select", label: "Genuine or Aftermarket", options: pairs([["genuine", "Genuine (OEM)"], ["aftermarket", "Aftermarket"]]) },
      { key: "condition", type: "select", label: "Condition", options: [...vehicleCondition, { value: "for_parts", label: "For Parts / Not Working" }] },
      { key: "compatibility", type: "tags", label: "Compatible With", placeholder: "Type a make/model and press Enter" },
      { key: "quantity", type: "number", label: "Quantity", min: 1, width: "half" },
      // Same field as Marketplace; small parts are often posted.
      { key: "dealMethod", type: "multiselect", label: "Deal Method", options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]) },
      { ...price, width: "half" },
      negotiable,
    ],
  },
];

// Bicycles have no year, registration or history to ask about.
const notBicycle = { field: "vehicleType", notIn: ["bicycle"] };

function evSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  const india = country === "IN";
  return [
    basics,
    {
      title: "Vehicle",
      fields: [
        listedBy,
        {
          key: "vehicleType",
          type: "select",
          label: "Vehicle Type",
          required: true,
          options: pairs([
            ["car", "Car"],
            ["motorcycle", "Motorcycle / Scooter"],
            ["van", "Van"],
            // E-rickshaws are a large Indian EV market.
            ...(india ? ([["three_wheeler", "Three-wheeler"]] as [string, string][]) : []),
            ["bicycle", "Bicycle"],
            ["other", "Other"],
          ]),
        },
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        ...makeModelPicked(c.evMakes),
        { key: "year", type: "number", label: "Year", required: true, width: "half", showWhen: notBicycle },
        distance(country),
        { key: "batteryCapacity", type: "number", label: "Battery Capacity", unit: "kWh", min: 0, max: 1000, width: "half" },
        { key: "rangeKm", type: "number", label: "Range", unit: gb ? "miles" : "km", min: 0, max: 5000, width: "half" },
        // The main wear figure for a used EV, as mileage is for a petrol car.
        { key: "batteryHealth", type: "number", label: "Battery Health", unit: "%", min: 0, max: 100, width: "half" },
        { key: "batteryWarrantyUntil", type: "date", label: "Battery Warranty Until", width: "half" },
        { key: "motorPower", type: "number", label: "Motor Power", unit: "kW", min: 0, max: 2000, width: "half" },
        // Which public chargers fit — replaces the old AC / DC / Both choice.
        {
          key: "chargingPort",
          type: "select",
          label: "Charging Port",
          options: india
            ? pairs([["type2", "Type 2"], ["ccs2", "CCS2"], ["bharat", "Bharat (AC / DC)"], ["other", "Other"]])
            : pairs([["type2", "Type 2"], ["ccs2", "CCS2"], ["chademo", "CHAdeMO"], ["other", "Other"]]),
        },
        { key: "dcFastCharging", type: "select", label: "DC Fast Charging", options: YES_NO_TEXT },
        { key: "chargerIncluded", type: "select", label: "Home Charger Included", options: YES_NO_TEXT },
        { key: "color", type: "select", label: "Color", options: VEHICLE_COLORS },
        { ...price, width: "half" },
        negotiable,
      ],
    },
    { title: "History", fields: historyFields(country).map((f) => ({ ...f, showWhen: notBicycle })) },
  ];
}

// Wanted: which fields apply depends on what the buyer is looking for.
const lookingFor = (values: string[]) => ({ field: "vehicleType", in: values });

function wantedSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  return [
    basics,
    {
      title: "Looking For",
      fields: [
        {
          key: "vehicleType",
          type: "select",
          label: "Vehicle Category",
          required: true,
          // Matches the selling subcategories.
          options: pairs([
            ["car", "Car"],
            ["motorcycle", "Motorcycle"],
            ["van", "Van"],
            ["truck", "Truck"],
            ["boat", "Boat"],
            ["electric", "Electric Vehicle"],
            ["parts", "Parts"],
          ]),
        },
        { key: "partWanted", type: "text", label: "Part Wanted", placeholder: "Part name or number", showWhen: lookingFor(["parts"]) },
        {
          key: "make",
          type: "select",
          display: "dropdown",
          label: "Preferred Make",
          options: opts(["Any", ...c.carMakes, "Other"]),
          width: "half",
          showWhen: { field: "vehicleType", notIn: ["parts"] },
        },
        { key: "makeOther", type: "text", label: "Other Make", width: "half", showWhen: { field: "make", in: ["Other"] } },
        { key: "model", type: "text", label: "Preferred Model", width: "half", showWhen: { field: "vehicleType", notIn: ["parts"] } },
        // Its own key: saved as "year" it read as the vehicle's actual year in search.
        { key: "minYear", type: "number", label: "Min Year", min: 1900, max: 2100, width: "half", showWhen: { field: "vehicleType", notIn: ["parts"] } },
        {
          key: "maxMileage",
          type: "number",
          label: "Max Mileage",
          unit: gb ? "miles" : "km",
          min: 0,
          max: 5_000_000,
          width: "half",
          showWhen: lookingFor(["car", "motorcycle", "van", "truck", "electric"]),
        },
        { key: "maxBudget", type: "currency", label: "Max Budget", required: true, min: 1, width: "half" },
        { key: "bodyType", type: "select", label: "Body Type", options: carBodyTypes(country), showWhen: lookingFor(["car"]) },
        { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes, showWhen: lookingFor(["car", "motorcycle", "van", "truck"]) },
        { key: "transmission", type: "select", label: "Transmission", options: transmission.slice(0, 2), showWhen: lookingFor(["car", "van", "truck"]) },
        { key: "condition", type: "select", label: "Condition", options: pairs([["new", "New"], ["used", "Used"], ["any", "Any"]]) },
        { key: "buyingFrom", type: "select", label: "Buying From", options: pairs([["owner", "Owner"], ["dealer", "Dealer"], ["any", "Any"]]) },
        { key: "neededBy", type: "select", label: "Needed By", options: pairs([["asap", "As soon as possible"], ["month", "Within a month"], ["looking", "Just looking"]]) },
      ],
    },
  ];
}

export const VEHICLES_SUBCATEGORIES = [
  "Cars",
  "Motorcycle",
  "Van",
  "Truck",
  "Boats",
  "Parts & Accessories",
  "Electric Vehicles",
  "Wanted",
];

export function vehiclesSections(subcategory: string, country: string): FormSection[] | null {
  const c = getVehicleConfig(country);

  switch (subcategory) {
    case "Cars":
      return carsSections(country, c);

    case "Motorcycle":
      return motorcycleSections(country, c);

    case "Van":
      return vanSections(country, c);

    case "Truck":
      return truckSections(country, c);

    case "Boats":
      return boatsSections(country);

    case "Parts & Accessories":
      return partsSections;

    case "Electric Vehicles":
      return evSections(country, c);

    case "Wanted":
      return wantedSections(country, c);

    default:
      return null;
  }
}
