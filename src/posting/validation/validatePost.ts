import { propertyConfig } from "@/posting/config/property";
import { jobConfig } from "@/posting/config/job";
import { vehiclesConfig } from "@/posting/config/vehicles";
import { servicesConfig } from "@/posting/config/services";
import { petConfig } from "../config/pet";
import { forsaleConfig } from "../config/forsale";
import { businessConfig } from "../config/business";
import { communityConfig } from "../config/community";
import { specialOffersConfig } from "../config/specialOffers";

function isEmpty(value: any) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function getCategoryConfig(category: string) {
  switch (category.toLowerCase()) {
    case "property":
      return propertyConfig;

    case "job":
    case "jobs":
      return jobConfig;

      case "vehicles":
      return vehiclesConfig;

      case "services":
      return servicesConfig;

    case "pet":
      return petConfig;

      case "forsale":
      return forsaleConfig;

      case "business":
      return businessConfig;

      case "community":
      return communityConfig;

      case "special offers":
      return specialOffersConfig;

    default:
      return null;
  }
}

export function validatePost(
  category: string,
  subcategory: string,
  data: any
) {
  const config = getCategoryConfig(category);

  if (!config) return {};

  const specs = config[subcategory];
  if (!specs) return {};

  const errors: Record<string, string> = {};

  specs
    .filter((f: any) => f.required)
    .forEach((field: any) => {
      const value = data[field.key];

      if (isEmpty(value)) {
        errors[field.key] = `${field.label} is required`;
      }
    });

  return errors;
}
