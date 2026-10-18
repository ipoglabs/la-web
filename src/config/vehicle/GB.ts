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
  carMakes: [
    "Ford", "Vauxhall", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Toyota",
    "Nissan", "Kia", "Hyundai", "Peugeot", "Renault", "Skoda", "SEAT", "Honda",
    "Mazda", "MINI", "Land Rover", "Jaguar", "Volvo", "Tesla", "MG", "Citroen",
    "Fiat", "Suzuki", "Dacia", "Lexus", "Porsche",
  ],
  motorcycleMakes: [
    "Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Triumph", "Ducati", "Harley-Davidson",
    "KTM", "Royal Enfield", "Aprilia", "Husqvarna", "Vespa", "Piaggio", "Lexmoto",
  ],
  budgetPlaceholder: "e.g. 15000",
};
