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
    "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", "BYD",
    "Chevrolet", "Chrysler", "Citroen", "Cupra", "Dacia", "Daihatsu", "Dodge", "DS",
    "Ferrari", "Fiat", "Ford", "Genesis", "GWM Ora", "Honda", "Hyundai", "Infiniti",
    "Isuzu", "Jaecoo", "Jaguar", "Jeep", "KGM SsangYong", "Kia", "Lamborghini",
    "Land Rover", "Leapmotor", "Lexus", "Lotus", "Maserati", "Mazda", "McLaren",
    "Mercedes-Benz", "MG", "MINI", "Mitsubishi", "Morgan", "Nissan", "Omoda", "Peugeot",
    "Polestar", "Porsche", "Proton", "Renault", "Rolls-Royce", "Rover", "Saab", "SEAT",
    "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Vauxhall", "Volkswagen",
    "Volvo", "Xpeng",
  ],
  motorcycleMakes: [
    "AJS", "Aprilia", "Benelli", "Beta", "BMW", "Brixton", "BSA", "CFMoto", "Ducati",
    "Energica", "GasGas", "Harley-Davidson", "Herald", "Honda", "Husqvarna", "Hyosung",
    "Indian", "Kawasaki", "Keeway", "KTM", "Kymco", "Lambretta", "Lexmoto", "Mash",
    "Moto Guzzi", "MV Agusta", "Norton", "Piaggio", "Royal Enfield", "Sherco", "Sinnis",
    "Super Soco", "Suzuki", "SYM", "Triumph", "Ural", "Vespa", "Yamaha", "Zero", "Zontes",
  ],
  vanMakes: [
    "Citroen", "Farizon", "Fiat", "Ford", "Hyundai", "Ineos", "Isuzu", "Iveco",
    "KGM SsangYong", "Kia", "Land Rover", "LDV", "MAN", "Maxus", "Mercedes-Benz",
    "Mitsubishi", "Nissan", "Peugeot", "Renault", "Toyota", "Vauxhall", "Volkswagen",
  ],
  truckMakes: [
    "DAF", "Dennis Eagle", "ERF", "Foden", "Ford", "Fuso", "Hino", "Isuzu", "Iveco",
    "Leyland", "MAN", "Mercedes-Benz", "Renault", "Scania", "Seddon Atkinson", "Volvo",
  ],
  evMakes: [
    "Abarth", "Alpine", "Audi", "BMW", "BYD", "Citroen", "Cupra", "DS", "Energica", "Fiat",
    "Ford", "Genesis", "Honda", "Hyundai", "Jaguar", "Kia", "Leapmotor", "Lexus", "Lotus",
    "Maxus", "Mercedes-Benz", "MG", "MINI", "Nissan", "NIU", "Omoda", "Peugeot", "Polestar",
    "Porsche", "Renault", "Skoda", "Smart", "Subaru", "Super Soco", "Tesla", "Toyota",
    "Vauxhall", "Volkswagen", "Volvo", "Xpeng", "Zero",
  ],
  budgetPlaceholder: "e.g. 15000",
};
