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
  motorcycleMakes: [
    "Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Triumph", "Ducati", "Harley-Davidson",
    "KTM", "Royal Enfield", "Aprilia", "Benelli", "Vespa", "Piaggio",
  ],
  vanMakes: ["Toyota", "Nissan", "Hyundai", "Isuzu", "Mercedes-Benz", "Ford", "Volkswagen", "Maxus", "Mitsubishi", "Kia"],
  truckMakes: ["Isuzu", "Hino", "Mitsubishi Fuso", "Nissan UD", "Volvo", "Scania", "Mercedes-Benz", "MAN", "DAF", "Toyota"],
  budgetPlaceholder: "e.g. 50000",
};
