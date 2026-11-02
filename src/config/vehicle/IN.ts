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
  carMakes: [
    "Aston Martin", "Audi", "Bentley", "BMW", "BYD", "Chevrolet", "Citroen", "Daewoo",
    "Datsun", "Ferrari", "Fiat", "Force", "Ford", "Hindustan Motors", "Honda", "Hyundai",
    "Isuzu", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lotus",
    "Mahindra", "Maruti Suzuki", "Maserati", "McLaren", "Mercedes-Benz", "MG", "MINI",
    "Mitsubishi", "Nissan", "Opel", "Porsche", "Premier", "Renault", "Rolls-Royce", "Skoda",
    "Tata", "Tesla", "Toyota", "VinFast", "Volkswagen", "Volvo",
  ],
  motorcycleMakes: [
    "Ampere", "Aprilia", "Ather", "Bajaj", "Benelli", "BMW", "BSA", "CFMoto", "Ducati",
    "Harley-Davidson", "Hero", "Hero Electric", "Honda", "Husqvarna", "Hyosung", "Indian",
    "Jawa", "Kawasaki", "Keeway", "Kinetic", "KTM", "LML", "Mahindra", "Matter",
    "Moto Guzzi", "MV Agusta", "Okinawa", "Ola Electric", "Piaggio", "Pure EV", "QJ Motor",
    "Revolt", "River", "Royal Enfield", "Simple Energy", "Suzuki", "Tork", "Triumph", "TVS",
    "Ultraviolette", "Vespa", "Yamaha", "Yezdi", "Zontes",
  ],
  vanMakes: [
    "Ashok Leyland", "Atul", "Bajaj", "Eicher", "Euler", "Force", "Hyundai", "Isuzu", "Kia",
    "Mahindra", "Maruti Suzuki", "Mercedes-Benz", "Nissan", "Piaggio", "Renault",
    "SML Isuzu", "Tata", "Toyota", "Volkswagen",
  ],
  truckMakes: [
    "AMW", "Ashok Leyland", "Atul", "Bajaj", "BharatBenz", "Eicher", "Euler", "Force",
    "Hindustan Motors", "Isuzu", "Mahindra", "MAN", "Mercedes-Benz", "Olectra", "Piaggio",
    "Scania", "SML Isuzu", "Tata", "Volvo",
  ],
  evMakes: [
    "Ampere", "Ather", "Audi", "Bajaj", "BMW", "BYD", "Citroen", "Euler", "Hero Electric",
    "Hyundai", "Jaguar", "Kia", "Kinetic Green", "Mahindra", "Mahindra Last Mile", "Matter",
    "Mercedes-Benz", "MG", "MINI", "Okinawa", "Ola Electric", "Piaggio", "Porsche",
    "Pure EV", "Revolt", "River", "Simple Energy", "Tata", "Tesla", "Tork", "TVS",
    "Ultraviolette", "VinFast", "Volvo",
  ],
  budgetPlaceholder: "e.g. 1000000",
};

/** States and union territories — a car's registering RTO state. */
export const IN_REGISTRATION_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
