import type { VehicleFormConfig } from "./types";

export const SGVehicleConfig: VehicleFormConfig = {
  carFuelTypes: [
    { value: "petrol",   label: "Petrol" },
    { value: "diesel",   label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid",   label: "Hybrid" },
    { value: "cng",      label: "CNG" },
  ],
  motorcycleFuelTypes: [
    { value: "petrol",   label: "Petrol" },
    { value: "electric", label: "Electric" },
    { value: "hybrid",   label: "Hybrid" },
  ],
  carMakes: [
    "Toyota", "Honda", "Mercedes-Benz", "BMW", "Mazda", "Hyundai", "Kia",
    "Nissan", "Volkswagen", "Audi", "Lexus", "Mitsubishi", "Subaru", "Volvo",
    "Tesla", "BYD", "MG", "Skoda", "Peugeot", "Porsche",
  ],
  budgetPlaceholder: "e.g. 50000",
};
