import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Health & Beauty forms' (posting/form-schema/defaults/health-beauty.ts):
// each sub's Type is `itemType` (Salons & Spas: the `services` list), Mode is
// `consultationMode` (lib/postFilterQuery.ts HEALTH_FORM_FILTERS).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

/** In-person / Online — a "Both" service shows under either. */
const mode: FilterConfig = {
  id: "mode",
  label: "Mode",
  type: "toggle",
  singleSelect: true,
  options: opts([["inperson", "In-person"], ["online", "Online"]]),
};

const homeVisits: FilterConfig = {
  id: "home_visits",
  label: "Home Visits",
  type: "toggle",
  singleSelect: true,
  options: opts([["yes", "Comes to you"]]),
};

export const healthBeauty: MainCategory = {
  id: "health_beauty",
  label: "Health & Beauty",
  description: "Gyms, salons, wellness, fitness, and medical services.",
  icon: "heart",
  iconBg: "bg-fuchsia-100",
  iconColor: "text-fuchsia-600",
  subcategories: [
    {
      id: "gyms_fitness",
      label: "Fitness Classes & Training",
      icon: "activity",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["gym", "Gym"], ["yoga", "Yoga"], ["pilates", "Pilates"], ["crossfit", "CrossFit"], ["pt", "Personal Trainer"], ["group", "Group Classes"], ["martial_arts", "Martial Arts"], ["dance", "Dance Fitness"], ["other", "Other"]]),
        },
        mode,
      ],
    },
    {
      id: "salons_spas",
      label: "Salons & Spas",
      icon: "scissors",
      filters: [
        {
          id: "service",
          label: "Service",
          type: "toggle",
          options: opts([["hair", "Hair"], ["nails", "Nails"], ["lashes_brows", "Lashes & Brows"], ["waxing", "Waxing & Threading"], ["makeup", "Makeup"], ["skincare", "Facials & Skincare"], ["massage", "Massage"], ["spa", "Spa Packages"], ["other", "Other"]]),
        },
        homeVisits,
      ],
    },
    {
      id: "medical",
      label: "Medical & Therapy",
      icon: "stethoscope",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["doctor", "GP / Doctor"], ["dentist", "Dentist"], ["physio", "Physiotherapy"], ["health_check", "Health Checks"], ["eye", "Eye Care"], ["specialist", "Specialist"], ["other", "Other"]]),
        },
        mode,
        homeVisits,
      ],
    },
    {
      id: "beauty_products",
      label: "Beauty Products",
      icon: "shopping-bag",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["skincare", "Skincare"], ["makeup", "Makeup"], ["fragrance", "Fragrance"], ["haircare", "Haircare"], ["hair_tools", "Hair Tools & Devices"], ["bath_body", "Bath & Body"], ["nails", "Nails"], ["mens", "Men's Grooming"], ["other", "Other"]]),
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          options: opts([["new", "New, Sealed"], ["like-new", "Opened, Unused"], ["lightly-used", "Lightly Used"], ["used", "Well Used"]]),
        },
      ],
    },
    {
      id: "wellness",
      label: "Wellness & Nutrition",
      icon: "leaf",
      filters: [
        {
          id: "wellness_type",
          label: "Type",
          type: "toggle",
          options: opts([["meditation", "Meditation & Mindfulness"], ["nutrition", "Nutrition & Diet"], ["massage", "Massage Therapy"], ["ayurveda", "Ayurveda & Traditional"], ["acupuncture", "Acupuncture"], ["retreat", "Retreats"], ["other", "Other"]]),
        },
        mode,
      ],
    },
    {
      id: "mental_health",
      label: "Mental Health & Counselling",
      icon: "brain",
      filters: [
        {
          id: "mh_type",
          label: "Type",
          type: "toggle",
          options: opts([["counselling", "Counselling"], ["therapy", "Psychotherapy"], ["coaching", "Life Coaching"], ["support_group", "Support Group"], ["other", "Other"]]),
        },
        mode,
      ],
    },
  ],
};
