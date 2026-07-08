import type { CategoryItem } from "./types";

export const electronicsTech: CategoryItem = {
  id: "electronics_tech",
  label: "Electronics & Tech",
  description: "Phones, laptops, gaming, cameras, and smart devices.",
  color: "red",
  cardIcon: "phone",
  subcategories: [
  { id: "mobile_tablets", label: "Mobile Phones & Tablets" },
  { id: "laptops_computers", label: "Laptops & Computers" },
  { id: "tvs_audio", label: "TVs & Audio" },
  { id: "gaming", label: "Gaming" },
  { id: "cameras_photography", label: "Cameras & Photography" },
  { id: "computer_parts", label: "Computer Parts & Components" },
  { id: "wearables_smart", label: "Wearables & Smart Devices" },
  { id: "tech_accessories", label: "Tech Accessories" },
  ],
};