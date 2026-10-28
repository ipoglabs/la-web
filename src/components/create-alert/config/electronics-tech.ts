import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Electronics & Tech forms' (posting/form-schema/defaults/electronics-tech.ts):
// each sub's Type is `itemType`; phones, laptops and cameras also save a
// `brand` from a list (lib/postFilterQuery.ts ELECTRONICS_FORM_FILTERS).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const condition: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  options: opts([["new", "Brand New"], ["like-new", "Like New"], ["lightly-used", "Lightly Used"], ["used", "Well Used"], ["heavily-used", "Heavily Used"], ["for-parts", "For Parts / Not Working"]]),
};

const delivery: FilterConfig = {
  id: "delivery",
  label: "Delivery",
  type: "toggle",
  singleSelect: true,
  options: opts([["delivery", "Delivery available"]]),
};

const type = (entries: [string, string][], label = "Type"): FilterConfig => ({ id: "type", label, type: "toggle", options: opts(entries) });
const brand = (entries: [string, string][]): FilterConfig => ({ id: "brand", label: "Brand", type: "toggle", options: opts([...entries, ["other", "Other"]]) });

export const electronicsTech: MainCategory = {
  id: "electronics_tech",
  label: "Electronics & Tech",
  description: "Phones, laptops, gaming, cameras, and smart devices.",
  icon: "smartphone",
  iconBg: "bg-red-100",
  iconColor: "text-red-600",
  subcategories: [
    {
      id: "mobile_tablets",
      label: "Mobile Phones & Tablets",
      icon: "smartphone",
      filters: [
        type([["phone", "Smartphone"], ["tablet", "Tablet"], ["basic", "Basic / Feature Phone"]]),
        brand([["apple", "Apple"], ["samsung", "Samsung"], ["google", "Google"], ["oneplus", "OnePlus"], ["xiaomi", "Xiaomi"], ["oppo", "OPPO"], ["vivo", "vivo"], ["realme", "realme"], ["motorola", "Motorola"], ["nokia", "Nokia"]]),
        {
          id: "storage",
          label: "Storage",
          type: "toggle",
          options: opts([["32", "32GB or less"], ["64", "64GB"], ["128", "128GB"], ["256", "256GB"], ["512", "512GB"], ["1tb", "1TB+"]]),
        },
        {
          id: "network",
          label: "Network",
          type: "toggle",
          singleSelect: true,
          options: opts([["unlocked", "Unlocked"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "laptops_computers",
      label: "Laptops & Computers",
      icon: "laptop",
      filters: [
        type([["laptop", "Laptop"], ["desktop", "Desktop"], ["aio", "All-in-One"], ["mini_pc", "Mini PC"], ["monitor", "Monitor"], ["other", "Other"]]),
        brand([["apple", "Apple"], ["dell", "Dell"], ["hp", "HP"], ["lenovo", "Lenovo"], ["asus", "Asus"], ["acer", "Acer"], ["msi", "MSI"], ["microsoft", "Microsoft"], ["samsung", "Samsung"]]),
        condition,
        delivery,
      ],
    },
    {
      id: "tvs_audio",
      label: "TVs & Audio",
      icon: "monitor",
      filters: [
        type([["tv", "TV"], ["projector", "Projector"], ["soundbar", "Soundbar"], ["speakers", "Speakers"], ["hifi", "Hi-Fi & Turntables"], ["headphones", "Headphones"], ["earbuds", "Earbuds"], ["cinema", "Home Cinema"], ["other", "Other"]]),
        {
          id: "screen_size",
          label: "Screen Size",
          type: "toggle",
          options: opts([["under_32", "Under 32\""], ["32_49", "32–49\""], ["50_65", "50–64\""], ["65plus", "65\" and over"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "gaming",
      label: "Gaming",
      icon: "gamepad",
      filters: [
        {
          id: "platform",
          label: "Platform",
          type: "toggle",
          options: opts([["ps", "PlayStation"], ["xbox", "Xbox"], ["nintendo", "Nintendo"], ["pc", "PC"], ["mobile", "Mobile"], ["other", "Other"]]),
        },
        { ...type([["console", "Console"], ["game", "Game"], ["controller", "Controller"], ["vr", "VR Headset"], ["pc", "Gaming PC"], ["chair", "Gaming Chair & Desk"], ["accessory", "Accessory"], ["other", "Other"]]), id: "item_type" },
        condition,
        delivery,
      ],
    },
    {
      id: "cameras_photography",
      label: "Cameras & Photography",
      icon: "camera",
      filters: [
        type([["dslr", "DSLR"], ["mirrorless", "Mirrorless"], ["compact", "Compact"], ["action", "Action Cam"], ["drone", "Drone"], ["lens", "Lens"], ["lighting", "Lighting & Flash"], ["tripod", "Tripod & Support"], ["accessory", "Accessory"], ["other", "Other"]]),
        brand([["canon", "Canon"], ["sony", "Sony"], ["nikon", "Nikon"], ["fujifilm", "Fujifilm"], ["panasonic", "Panasonic"], ["olympus", "OM System / Olympus"], ["gopro", "GoPro"], ["dji", "DJI"], ["godox", "Godox"]]),
        condition,
        delivery,
      ],
    },
    {
      id: "computer_parts",
      label: "Computer Parts & Components",
      icon: "cpu",
      filters: [
        type([["gpu", "GPU"], ["cpu", "CPU"], ["ram", "RAM"], ["storage", "SSD / HDD"], ["motherboard", "Motherboard"], ["psu", "PSU"], ["case", "Case"], ["cooling", "Cooling"], ["other", "Other"]], "Component"),
        condition,
        delivery,
      ],
    },
    {
      id: "wearables_smart",
      label: "Wearables & Smart Devices",
      icon: "watch",
      filters: [
        type([["smartwatch", "Smartwatch"], ["tracker", "Fitness Tracker"], ["ring", "Smart Ring"], ["speaker", "Smart Speaker"], ["display", "Smart Display"], ["smart_home", "Smart Home"], ["other", "Other"]]),
        condition,
        delivery,
      ],
    },
    {
      id: "tech_accessories",
      label: "Tech Accessories",
      icon: "plug",
      filters: [
        type([["cases", "Cases & Covers"], ["chargers", "Chargers & Power Banks"], ["cables", "Cables & Adapters"], ["keyboards", "Keyboards"], ["mice", "Mice"], ["drives", "External Drives & Memory"], ["printers", "Printers & Scanners"], ["networking", "Routers & Networking"], ["other", "Other"]]),
        condition,
        delivery,
      ],
    },
  ],
};
