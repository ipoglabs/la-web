import type { CategoryItem } from "./types";

export const vehicles: CategoryItem = {
  id: "vehicles",
  label: "Vehicles",
  description: "Buy, sell, or rent cars, bikes and more.",
  color: "amber",
  cardIcon: "truck",
  subcategories: [
  { id: "cars", label: "Cars" },
  { id: "motorcycle", label: "Motorcycle" },
  { id: "van", label: "Van" },
  { id: "truck", label: "Truck" },
  { id: "boats", label: "Boats" },
  { id: "parts_accessories", label: "Parts & Accessories" },
  { id: "electric_vehicles", label: "Electric Vehicles" },
  { id: "wanted", label: "Wanted" },
  ],
};