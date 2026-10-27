import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Health & Beauty forms' (posting/form-schema/defaults/health-beauty.ts):
// each sub's Type is `itemType` (Salons & Spas: the `services` list), Mode is
// `consultationMode`, Suitable For `suitableFor`, Free Trial `freeTrial`,
// Language `languages`, Delivery the Deal Method `dealMethod`
// (lib/postFilterQuery.ts HEALTH_FORM_FILTERS).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

/** In-person / Online — a "Both" service shows under either. */
const mode: FilterConfig = {
  id: "mode",
  label: "Mode",
  type: "toggle",
  singleSelect: true,
  options: opts([["inperson", "In-person"], ["online", "Online"]]),
};

/** Ladies-only and men-only places. */
const suitableFor: FilterConfig = {
  id: "suitable_for",
  label: "Suitable For",
  type: "toggle",
  singleSelect: true,
  options: opts([["women", "Women only"], ["men", "Men only"]]),
};

const freeTrial: FilterConfig = {
  id: "free_trial",
  label: "Free Trial",
  type: "toggle",
  singleSelect: true,
  options: opts([["yes", "Free trial / first session"]]),
};

/** Every market's languages; lib/listing-filters.ts keeps each market's own (form: LANGUAGES). */
const language: FilterConfig = {
  id: "language",
  label: "Language",
  type: "toggle",
  options: opts([["english", "English"], ["hindi", "Hindi"], ["tamil", "Tamil"], ["telugu", "Telugu"], ["kannada", "Kannada"], ["malayalam", "Malayalam"], ["bengali", "Bengali"], ["marathi", "Marathi"], ["gujarati", "Gujarati"], ["polish", "Polish"], ["urdu", "Urdu"], ["punjabi", "Punjabi"], ["arabic", "Arabic"], ["mandarin", "Mandarin"], ["malay", "Malay"], ["cantonese", "Cantonese"], ["hokkien", "Hokkien"], ["other", "Other"]]),
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
        suitableFor,
        freeTrial,
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
          options: opts([["hair", "Hair"], ["nails", "Nails"], ["lashes_brows", "Lashes & Brows"], ["waxing", "Waxing & Threading"], ["makeup", "Makeup"], ["skincare", "Facials & Skincare"], ["massage", "Massage"], ["spa", "Spa Packages"], ["bridal", "Bridal & Mehndi"], ["tattoo", "Tattoo & Piercing"], ["other", "Other"]]),
        },
        suitableFor,
        homeVisits,
        freeTrial,
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
          options: opts([["doctor", "GP / Doctor"], ["dentist", "Dentist"], ["physio", "Physiotherapy"], ["health_check", "Health Checks"], ["eye", "Eye Care"], ["podiatry", "Podiatry / Chiropody"], ["specialist", "Specialist"], ["other", "Other"]]),
        },
        mode,
        homeVisits,
        language,
        freeTrial,
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
        {
          id: "delivery",
          label: "Delivery",
          type: "toggle",
          singleSelect: true,
          options: opts([["delivery", "Delivery available"]]),
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
          options: opts([["meditation", "Meditation & Mindfulness"], ["nutrition", "Nutrition & Diet"], ["massage", "Massage Therapy"], ["ayurveda", "Ayurveda & Traditional"], ["acupuncture", "Acupuncture"], ["reiki", "Reiki & Energy Healing"], ["retreat", "Retreats"], ["other", "Other"]]),
        },
        mode,
        suitableFor,
        freeTrial,
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
        language,
        freeTrial,
      ],
    },
  ],
};
