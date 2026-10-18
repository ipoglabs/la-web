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
    "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Kia", "Toyota", "Honda",
    "MG", "Renault", "Skoda", "Volkswagen", "Nissan", "Jeep", "Citroen", "BYD",
    "Mercedes-Benz", "BMW", "Audi", "Volvo", "Ford", "Chevrolet", "Fiat",
  ],
  motorcycleMakes: [
    "Hero", "Honda", "Bajaj", "TVS", "Royal Enfield", "Yamaha", "Suzuki", "KTM",
    "Kawasaki", "Jawa", "Yezdi", "Harley-Davidson", "Triumph", "BMW", "Ather", "Ola Electric",
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
