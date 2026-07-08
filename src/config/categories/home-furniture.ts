import type { CategoryItem } from "./types";

export const homeFurniture: CategoryItem = {
  id: "home_furniture",
  label: "Home & Furniture",
  description: "Sofas, appliances, garden gear, decor, and DIY tools.",
  color: "stone",
  cardIcon: "storefront",
  subcategories: [
  { id: "sofas_seating", label: "Sofas & Seating" },
  { id: "beds_bedroom", label: "Beds & Bedroom" },
  { id: "tables_dining", label: "Tables, Desks & Dining" },
  { id: "kitchen_appliances", label: "Kitchen & Appliances" },
  { id: "storage_shelving", label: "Storage & Shelving" },
  { id: "home_decor", label: "Home Decor & Accessories" },
  { id: "garden_outdoor", label: "Garden & Outdoor" },
  { id: "diy_tools", label: "DIY, Tools & Hardware" },
  ],
};