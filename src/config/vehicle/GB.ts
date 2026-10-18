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
  vanMakes: [
    "Ford", "Volkswagen", "Mercedes-Benz", "Vauxhall", "Renault", "Peugeot", "Citroen",
    "Fiat", "Nissan", "Toyota", "Iveco", "MAN", "Maxus",
  ],
  truckMakes: ["DAF", "Scania", "Volvo", "Mercedes-Benz", "MAN", "Iveco", "Renault", "Isuzu", "Fuso", "Ford"],
  evMakes: [
    "Tesla", "BYD", "MG", "Kia", "Hyundai", "Volkswagen", "BMW", "Mercedes-Benz", "Audi",
    "Polestar", "Nissan", "Renault", "Peugeot", "Vauxhall", "Volvo", "Zero", "Energica",
  ],
  budgetPlaceholder: "e.g. 15000",
};
