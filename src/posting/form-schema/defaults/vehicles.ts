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

const paperwork: FormFieldDef[] = [
  { key: "ownerType", type: "select", label: "Owner Type", options: opts(["First Owner", "Second Owner", "Third Owner or more"]) },
  { key: "registrationNumber", type: "text", label: "Registration Number", width: "half" },
  { key: "insuranceValidTill", type: "date", label: "Insurance Valid Till", width: "half" },
  { key: "serviceHistory", type: "select", label: "Service History", options: serviceHistory },
];

const price: FormFieldDef = { key: "salePrice", type: "currency", label: "Price", required: true, min: 1 };

// ── Reworked per market: Cars, Motorcycle, Van ───────────────────────────────
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

/**
 * The History section per market. GB keeps the plate (buyers run a history
 * check) and adds MOT Expiry; SG drops the plate for COE Expiry; IN asks
 * the registering state instead of the plate. `extra` goes before Service
 * History (Cars: ULEZ in GB, registration date and depreciation in SG).
 */
function historyFields(country: string, extra: { GB?: FormFieldDef[]; SG?: FormFieldDef[] } = {}): FormFieldDef[] {
  const serviceHistoryField: FormFieldDef = { key: "serviceHistory", type: "select", label: "Service History", options: serviceHistory };
  if (country === "GB") {
    return [
      { key: "ownerType", type: "select", label: "Previous Owners", options: opts(["1", "2", "3", "4+"]) },
      { key: "registrationNumber", type: "text", label: "Registration Number", width: "half" },
      { key: "motExpiry", type: "date", label: "MOT Expiry", width: "half" },
      ...(extra.GB ?? []),
      serviceHistoryField,
    ];
  }
  if (country === "SG") {
    return [
      { key: "ownerType", type: "select", label: "No. of Owners", options: opts(["1", "2", "3+"]) },
      { key: "coeExpiry", type: "date", label: "COE Expiry", required: true, width: "half" },
      ...(extra.SG ?? []),
      serviceHistoryField,
    ];
  }
  return [
    { key: "ownerType", type: "select", label: "Owner Type", options: opts(["First Owner", "Second Owner", "Third Owner or more"]) },
    { key: "registrationState", type: "select", display: "dropdown", label: "Registration State (RTO)", options: opts(IN_REGISTRATION_STATES), width: "half" },
    { key: "insuranceValidTill", type: "date", label: "Insurance Valid Till", width: "half" },
    serviceHistoryField,
  ];
}
// Saved as a number (8 = "8+").
const CAR_SEATS = [
  ...["2", "4", "5", "6", "7"].map((v) => ({ value: v, label: v })),
  { value: "8", label: "8+" },
];

function carsSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  const india = country === "IN";

  const bodyType = opts(["SUV", "Sedan", "Hatchback", ...(india ? ["MUV"] : []), "Coupe", "MPV", "Estate", "Convertible", "Pickup"])
    // GB says Saloon; stored as Sedan everywhere.
    .map((o) => (gb && o.value === "Sedan" ? { ...o, label: "Saloon" } : o));

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
      return [
        basics,
        {
          title: "Vehicle",
          fields: [
            ...makeModel(true),
            { key: "year", type: "number", label: "Year", required: true, width: "half" },
            { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
            { key: "payloadCapacity", type: "number", label: "Payload", unit: "tons", min: 0, max: 500, width: "half" },
            { key: "gvwr", type: "number", label: "GVWR", unit: "kg", min: 0, max: 1_000_000, width: "half" },
            { key: "bodyType", type: "select", label: "Body Type", options: pairs([["tipper", "Tipper"], ["box", "Box"], ["flatbed", "Flatbed"], ["tanker", "Tanker"], ["trailer", "Trailer"]]) },
            { key: "axleConfig", type: "select", label: "Axle Config", options: opts(["4x2", "6x2", "6x4", "8x2", "8x4"]) },
            { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes },
            { key: "transmission", type: "select", label: "Transmission", options: transmission },
            { key: "condition", type: "select", label: "Condition", options: vehicleCondition },
            price,
          ],
        },
        { title: "History", fields: paperwork },
      ];

    case "Boats":
      return [
        basics,
        {
          title: "Boat",
          fields: [
            { key: "boatType", type: "select", label: "Boat Type", required: true, options: pairs([["motor", "Motor"], ["sail", "Sail"], ["yacht", "Yacht"], ["fishing", "Fishing"], ["jetski", "Jet Ski"], ["other", "Other"]]) },
            ...makeModel(false),
            { key: "year", type: "number", label: "Year", width: "half" },
            { key: "lengthFt", type: "number", label: "Length", unit: "ft", min: 1, max: 1000, width: "half" },
            { key: "engineType", type: "select", label: "Engine Type", options: pairs([["inboard", "Inboard"], ["outboard", "Outboard"], ["none", "None"]]) },
            { key: "condition", type: "select", label: "Condition", options: vehicleCondition },
            price,
          ],
        },
      ];

    case "Parts & Accessories":
      return [
        basics,
        {
          title: "Part",
          fields: [
            { key: "partsCategory", type: "select", label: "Parts Category", required: true, options: pairs([["engine", "Engine"], ["electrical", "Electrical"], ["interior", "Interior"], ["exterior", "Exterior"], ["tyres", "Tyres"], ["others", "Others"]]) },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "condition", type: "select", label: "Condition", options: vehicleCondition },
            { key: "compatibility", type: "tags", label: "Compatible With", placeholder: "Type a make/model and press Enter" },
            price,
          ],
        },
      ];

    case "Electric Vehicles":
      return [
        basics,
        {
          title: "Vehicle",
          fields: [
            { key: "vehicleType", type: "select", label: "Vehicle Type", required: true, options: pairs([["car", "Car"], ["motorcycle", "Motorcycle / Scooter"], ["bicycle", "Bicycle"], ["other", "Other"]]) },
            ...makeModel(true),
            { key: "year", type: "number", label: "Year", width: "half" },
            { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
            { key: "batteryCapacity", type: "number", label: "Battery Capacity", unit: "kWh", min: 0, max: 1000, width: "half" },
            { key: "rangeKm", type: "number", label: "Range", unit: "km", min: 0, max: 5000, width: "half" },
            { key: "chargingType", type: "select", label: "Charging Type", options: pairs([["ac", "AC"], ["dc", "DC Fast"], ["both", "Both"]]) },
            { key: "color", type: "text", label: "Color", width: "half" },
            { key: "condition", type: "select", label: "Condition", options: vehicleCondition },
            price,
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            { key: "vehicleType", type: "select", label: "Vehicle Category", required: true, options: pairs([["car", "Car"], ["motorcycle", "Motorcycle"], ["van", "Van"], ["truck", "Truck"], ["parts", "Parts"]]) },
            { key: "make", type: "text", label: "Preferred Make", width: "half" },
            { key: "model", type: "text", label: "Preferred Model", width: "half" },
            { key: "year", type: "number", label: "Min Year", width: "half" },
            { key: "maxBudget", type: "currency", label: "Max Budget", required: true, min: 1, width: "half" },
            { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes },
            { key: "transmission", type: "select", label: "Transmission", options: transmission.slice(0, 2) },
          ],
        },
      ];

    default:
      return null;
  }
}
