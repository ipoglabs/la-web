// Default "Vehicles" post-form schemas.

import { getVehicleConfig } from "@/config/vehicle";
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
      return [
        basics,
        {
          title: "Vehicle",
          fields: [
            ...makeModel(true),
            { key: "year", type: "number", label: "Year", required: true, width: "half" },
            { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
            { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes },
            { key: "transmission", type: "select", label: "Transmission", options: transmission },
            { key: "bodyType", type: "select", label: "Body Type", options: opts(["SUV", "Sedan", "Hatchback", "Coupe", "MPV", "Estate", "Convertible", "Pickup"]) },
            { key: "color", type: "text", label: "Color", width: "half" },
            { key: "seatingCapacity", type: "number", label: "Seats", min: 1, width: "half" },
            price,
          ],
        },
        { title: "History", fields: paperwork },
      ];

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
