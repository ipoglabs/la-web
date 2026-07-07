import type { VehicleFormConfig } from "./types";

export const GBVehicleConfig: VehicleFormConfig = {
  carFuelTypes: [
    { value: "petrol",   label: "Petrol" },
    { value: "diesel",   label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid",   label: "Hybrid" },
    { value: "lpg",      label: "LPG" },
  ],
  motorcycleFuelTypes: [
    { value: "petrol",   label: "Petrol" },
    { value: "electric", label: "Electric" },
    { value: "hybrid",   label: "Hybrid" },
  ],
  budgetPlaceholder: "e.g. 15000",
};
