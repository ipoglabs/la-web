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
    "Aion", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "BYD", "Chery",
    "Citroen", "Cupra", "Daihatsu", "Denza", "DS", "Ferrari", "Ford", "Honda", "Hyundai",
    "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lotus",
    "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MG", "MINI", "Mitsubishi", "Nissan",
    "Opel", "Ora", "Perodua", "Peugeot", "Polestar", "Porsche", "Proton", "Renault",
    "Rolls-Royce", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota",
    "Volkswagen", "Volvo", "Xpeng", "Zeekr",
  ],
  motorcycleMakes: [
    "Aprilia", "Bajaj", "Benelli", "BMW", "Brixton", "CFMoto", "Ducati", "GPX",
    "Harley-Davidson", "Honda", "Husqvarna", "Indian", "Kawasaki", "Keeway", "KTM", "Kymco",
    "Modenas", "Moto Guzzi", "MV Agusta", "Piaggio", "Royal Enfield", "Suzuki", "SYM",
    "Triumph", "TVS", "Vespa", "Yamaha", "Zero", "Zontes",
  ],
  vanMakes: [
    "BYD", "Citroen", "Daihatsu", "Ford", "Foton", "Golden Dragon", "Hyundai", "Isuzu",
    "Kia", "King Long", "Maxus", "Mercedes-Benz", "Mitsubishi", "Nissan", "Peugeot",
    "Renault", "Suzuki", "Toyota", "Volkswagen",
  ],
  truckMakes: [
    "BYD", "DAF", "Foton", "Hino", "Hyundai", "Isuzu", "Iveco", "MAN", "Mercedes-Benz",
    "Mitsubishi Fuso", "Nissan UD", "Scania", "Shacman", "Sinotruk", "Toyota", "Volvo",
  ],
  evMakes: [
    "Aion", "Audi", "BMW", "BYD", "Citroen", "Cupra", "Denza", "Hyundai", "Jaguar", "Kia",
    "Lexus", "Lotus", "Mercedes-Benz", "MG", "MINI", "Nissan", "Ora", "Peugeot", "Polestar",
    "Porsche", "Renault", "Smart", "Tesla", "Toyota", "Volvo", "Xpeng", "Zeekr", "Zero",
  ],
  budgetPlaceholder: "e.g. 50000",
};
