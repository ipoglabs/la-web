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

// ── Cars ─────────────────────────────────────────────────────────────────────
// Reworked per market (Vehicles › Cars review, 2026-10-18): GB mileage in
// miles with MOT and ULEZ, SG COE details, IN registering state instead of
// the plate. The other subcategories still share makeModel / paperwork.

// Same stored "Yes" / "No" as Property's Negotiable.
const YES_NO_TEXT = opts(["Yes", "No"]);
const CAR_COLORS = opts(["White", "Black", "Silver", "Grey", "Blue", "Red", "Brown", "Green", "Other"]);
// Saved as a number (8 = "8+").
const CAR_SEATS = [
  ...["2", "4", "5", "6", "7"].map((v) => ({ value: v, label: v })),
  { value: "8", label: "8+" },
];

function carsSections(country: string, c: VehicleFormConfig): FormSection[] {
  const gb = country === "GB";
  const sg = country === "SG";
  const india = country === "IN";

  const bodyType = opts(["SUV", "Sedan", "Hatchback", ...(india ? ["MUV"] : []), "Coupe", "MPV", "Estate", "Convertible", "Pickup"])
    // GB says Saloon; stored as Sedan everywhere.
    .map((o) => (gb && o.value === "Sedan" ? { ...o, label: "Saloon" } : o));

  const ownerType: FormFieldDef = gb
    ? { key: "ownerType", type: "select", label: "Previous Owners", options: opts(["1", "2", "3", "4+"]) }
    : sg
      ? { key: "ownerType", type: "select", label: "No. of Owners", options: opts(["1", "2", "3+"]) }
      : { key: "ownerType", type: "select", label: "Owner Type", options: opts(["First Owner", "Second Owner", "Third Owner or more"]) };

  const serviceHistoryField: FormFieldDef = { key: "serviceHistory", type: "select", label: "Service History", options: serviceHistory };

  const history: FormFieldDef[] = gb
    ? [
        ownerType,
        { key: "registrationNumber", type: "text", label: "Registration Number", width: "half" },
        { key: "motExpiry", type: "date", label: "MOT Expiry", width: "half" },
        { key: "ulezCompliant", type: "select", label: "ULEZ Compliant", options: YES_NO_TEXT },
        serviceHistoryField,
      ]
    : sg
      ? [
          ownerType,
          { key: "coeExpiry", type: "date", label: "COE Expiry", required: true, width: "half" },
          { key: "registrationDate", type: "date", label: "Registration Date", width: "half" },
          { key: "depreciationPerYear", type: "currency", label: "Depreciation per Year", unit: "/ year", min: 0, width: "half" },
          serviceHistoryField,
        ]
      : [
          ownerType,
          { key: "registrationState", type: "select", display: "dropdown", label: "Registration State (RTO)", options: opts(IN_REGISTRATION_STATES), width: "half" },
          { key: "insuranceValidTill", type: "date", label: "Insurance Valid Till", width: "half" },
          serviceHistoryField,
        ];

  return [
    basics,
    {
      title: "Vehicle",
      fields: [
        { key: "listedBy", type: "select", label: "Listed By", required: true, options: opts(["Owner", "Dealer"]) },
        { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
        { key: "make", type: "select", display: "dropdown", label: "Make", required: true, options: opts([...c.carMakes, "Other"]), width: "half" },
        { key: "makeOther", type: "text", label: "Other Make", required: true, width: "half", showWhen: { field: "make", in: ["Other"] } },
        { key: "model", type: "text", label: "Model", required: true, width: "half" },
        { key: "year", type: "number", label: "Year", required: true, width: "half" },
        gb
          ? { key: "kms", type: "number", label: "Mileage", unit: "miles", min: 0, width: "half" }
          : { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
        gb
          ? { key: "engineCapacity", type: "number", label: "Engine Size", unit: "litres", min: 0.5, width: "half" }
          : { key: "engineCapacity", type: "number", label: "Engine Size", unit: "cc", min: 50, width: "half" },
        { key: "fuelType", type: "select", label: "Fuel Type", options: [...c.carFuelTypes, { value: "phev", label: "Plug-in Hybrid" }] },
        // AMT (automated manual) is an Indian term.
        { key: "transmission", type: "select", label: "Transmission", options: india ? transmission : transmission.slice(0, 2) },
        { key: "bodyType", type: "select", label: "Body Type", options: bodyType },
        { key: "color", type: "select", label: "Color", options: CAR_COLORS },
        { key: "seatingCapacity", type: "select", label: "Seats", options: CAR_SEATS },
        { ...price, width: "half" },
        { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO_TEXT, defaultValue: "No", width: "half" },
      ],
    },
    { title: "History", fields: history },
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
      return [
        basics,
        {
          title: "Vehicle",
          fields: [
            ...makeModel(true),
            { key: "year", type: "number", label: "Year", required: true, width: "half" },
            { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
            { key: "engineCapacity", type: "number", label: "Engine Capacity", unit: "cc", min: 1, width: "half" },
            { key: "color", type: "text", label: "Color", width: "half" },
            { key: "fuelType", type: "select", label: "Fuel Type", options: c.motorcycleFuelTypes },
            { key: "transmission", type: "select", label: "Transmission", options: transmission.slice(0, 2) },
            { key: "condition", type: "select", label: "Condition", options: vehicleCondition.slice(0, 2) },
            price,
          ],
        },
        { title: "History", fields: paperwork },
      ];

    case "Van":
      return [
        basics,
        {
          title: "Vehicle",
          fields: [
            ...makeModel(true),
            { key: "year", type: "number", label: "Year", required: true, width: "half" },
            { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
            { key: "seatingCapacity", type: "number", label: "Seating Capacity", min: 1, width: "half" },
            { key: "color", type: "text", label: "Color", width: "half" },
            { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes },
            { key: "transmission", type: "select", label: "Transmission", options: transmission },
            { key: "condition", type: "select", label: "Condition", options: vehicleCondition },
            price,
          ],
        },
        { title: "History", fields: paperwork },
      ];

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
