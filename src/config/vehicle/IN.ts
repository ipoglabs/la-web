import type { VehicleFormConfig } from "./types";

export const INVehicleConfig: VehicleFormConfig = {
  carFuelTypes: [
    { value: "petrol",   label: "Petrol" },
    { value: "diesel",   label: "Diesel" },
    { value: "cng",      label: "CNG" },
    { value: "electric", label: "Electric" },
    { value: "hybrid",   label: "Hybrid" },
  ],
  motorcycleFuelTypes: [
    { value: "petrol",   label: "Petrol" },
    { value: "electric", label: "Electric" },
  ],
  budgetPlaceholder: "e.g. 1000000",
};
