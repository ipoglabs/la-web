// Default "Electronics & Tech" post-form schemas.
//
// Option values are what the Electronics & Tech search filters match
// (components/create-alert/config/electronics-tech.ts, lib/postFilterQuery.ts
// ELECTRONICS_FORM_FILTERS). Each sub's Type is `itemType`; phones, laptops
// and cameras pick a Brand from a list so the Brand filter can match it
// (Other asks the name). Items save the price as `salePrice`, the field
// listing prices and the price filter read.
//
// Phones ask storage and network lock, and TVs a screen-size band, as Gumtree
// and Carousell buyers search on them; Gaming asks the platform.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

const select = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "select",
  label,
  options: pairs(entries),
  width: "half",
  ...extra,
});
const multi = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "multiselect",
  label,
  options: pairs(entries),
  ...extra,
});
const text = (key: string, label: string, placeholder?: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half", ...extra });
const shownFor = (field: string, values: string[]) => ({ showWhen: { field, in: values } });
const itemType = (entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => select("itemType", "Type", entries, { required: true, ...extra });

/** Graded condition scale (Carousell / Gumtree style), as the other marketplace
 *  categories, plus For Parts for faulty kit. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
  ["for-parts", "For Parts / Not Working"],
];
const condition = select("condition", "Condition", CONDITION_SCALE, { required: true });
const brand = text("brand", "Brand");
const model = text("model", "Model");
const colour = text("color", "Colour");
const warranty = select("warranty", "Warranty", [["no", "No Warranty"], ["under-warranty", "Under Warranty"], ["extended", "Extended Warranty"]]);

/** Brand from a list (the Brand filter's options); Other asks the name. */
const brandList = (entries: [string, string][], required = true): FormFieldDef[] => [
  select("brand", "Brand", [...entries, ["other", "Other"]], { required, display: "dropdown" }),
  { ...text("otherBrand", "Brand Name"), ...shownFor("brand", ["other"]) },
];

/** Things for sale: price, negotiable, meet-up or delivery. */
const forSale = (title: string, fields: FormFieldDef[]): FormSection[] => [
  basics,
  { title, fields },
  {
    title: "Price & Delivery",
    fields: [
      { key: "salePrice", type: "currency", label: "Price", required: true, min: 1, width: "half" },
      { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" },
      multi("dealMethod", "Deal Method", [["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]),
    ],
  },
];

const PHONE_TYPES: [string, string][] = [["phone", "Smartphone"], ["tablet", "Tablet"], ["basic", "Basic / Feature Phone"]];
const COMPUTER_TYPES: [string, string][] = [["laptop", "Laptop"], ["desktop", "Desktop"], ["aio", "All-in-One"], ["mini_pc", "Mini PC"], ["monitor", "Monitor"], ["other", "Other"]];
const TV_TYPES: [string, string][] = [["tv", "TV"], ["projector", "Projector"], ["soundbar", "Soundbar"], ["speakers", "Speakers"], ["hifi", "Hi-Fi & Turntables"], ["headphones", "Headphones"], ["earbuds", "Earbuds"], ["cinema", "Home Cinema"], ["other", "Other"]];
const GAMING_TYPES: [string, string][] = [["console", "Console"], ["game", "Game"], ["controller", "Controller"], ["vr", "VR Headset"], ["pc", "Gaming PC"], ["chair", "Gaming Chair & Desk"], ["accessory", "Accessory"], ["other", "Other"]];
const CAMERA_TYPES: [string, string][] = [["dslr", "DSLR"], ["mirrorless", "Mirrorless"], ["compact", "Compact"], ["action", "Action Cam"], ["drone", "Drone"], ["lens", "Lens"], ["lighting", "Lighting & Flash"], ["tripod", "Tripod & Support"], ["accessory", "Accessory"], ["other", "Other"]];
const PART_TYPES: [string, string][] = [["gpu", "GPU"], ["cpu", "CPU"], ["ram", "RAM"], ["storage", "SSD / HDD"], ["motherboard", "Motherboard"], ["psu", "PSU"], ["case", "Case"], ["cooling", "Cooling"], ["other", "Other"]];
const WEARABLE_TYPES: [string, string][] = [["smartwatch", "Smartwatch"], ["tracker", "Fitness Tracker"], ["ring", "Smart Ring"], ["speaker", "Smart Speaker"], ["display", "Smart Display"], ["smart_home", "Smart Home"], ["other", "Other"]];
const ACCESSORY_TYPES: [string, string][] = [["cases", "Cases & Covers"], ["chargers", "Chargers & Power Banks"], ["cables", "Cables & Adapters"], ["keyboards", "Keyboards"], ["mice", "Mice"], ["drives", "External Drives & Memory"], ["printers", "Printers & Scanners"], ["networking", "Routers & Networking"], ["other", "Other"]];

export function electronicsTechSections(subcategory: string): FormSection[] | null {
  switch (subcategory) {
    case "Mobile Phones & Tablets":
      return forSale("Device", [
        itemType(PHONE_TYPES),
        ...brandList([["apple", "Apple"], ["samsung", "Samsung"], ["google", "Google"], ["oneplus", "OnePlus"], ["xiaomi", "Xiaomi"], ["oppo", "OPPO"], ["vivo", "vivo"], ["realme", "realme"], ["motorola", "Motorola"], ["nokia", "Nokia"]]),
        model,
        select("storage", "Storage", [["32", "32GB or less"], ["64", "64GB"], ["128", "128GB"], ["256", "256GB"], ["512", "512GB"], ["1tb", "1TB+"]], { required: true }),
        text("ram", "RAM", "e.g. 8 GB"),
        select("network", "Network", [["unlocked", "Unlocked"], ["locked", "Locked to a network"], ["wifi", "Wi-Fi only (tablet)"]]),
        text("batteryHealth", "Battery Health", "e.g. 94%"),
        colour,
        condition,
        warranty,
      ]);

    case "Laptops & Computers":
      return forSale("Computer", [
        itemType(COMPUTER_TYPES),
        ...brandList([["apple", "Apple"], ["dell", "Dell"], ["hp", "HP"], ["lenovo", "Lenovo"], ["asus", "Asus"], ["acer", "Acer"], ["msi", "MSI"], ["microsoft", "Microsoft"], ["samsung", "Samsung"]]),
        model,
        { ...text("processor", "Processor", "e.g. Intel i5 / Apple M2"), ...shownFor("itemType", ["laptop", "desktop", "aio", "mini_pc"]) },
        { ...text("ram", "RAM", "e.g. 16 GB"), ...shownFor("itemType", ["laptop", "desktop", "aio", "mini_pc"]) },
        { ...text("storage", "Storage", "e.g. 512 GB SSD"), ...shownFor("itemType", ["laptop", "desktop", "aio", "mini_pc"]) },
        { ...text("screenSize", "Screen Size", "e.g. 14 inch"), ...shownFor("itemType", ["laptop", "aio", "monitor"]) },
        condition,
        warranty,
      ]);

    case "TVs & Audio":
      return forSale("Item", [
        itemType(TV_TYPES),
        select("screenSize", "Screen Size", [["under_32", "Under 32\""], ["32_49", "32–49\""], ["50_65", "50–64\""], ["65plus", "65\" and over"]], { required: true, ...shownFor("itemType", ["tv"]) }),
        brand,
        model,
        condition,
        warranty,
      ]);

    case "Gaming":
      return forSale("Item", [
        itemType(GAMING_TYPES),
        select("platform", "Platform", [["ps", "PlayStation"], ["xbox", "Xbox"], ["nintendo", "Nintendo"], ["pc", "PC"], ["mobile", "Mobile"], ["other", "Other"]], { required: true, showWhen: { field: "itemType", notIn: ["chair"] } }),
        brand,
        model,
        condition,
      ]);

    case "Cameras & Photography":
      return forSale("Equipment", [
        itemType(CAMERA_TYPES, { width: "full" }),
        ...brandList([["canon", "Canon"], ["sony", "Sony"], ["nikon", "Nikon"], ["fujifilm", "Fujifilm"], ["panasonic", "Panasonic"], ["olympus", "OM System / Olympus"], ["gopro", "GoPro"], ["dji", "DJI"], ["godox", "Godox"]], false),
        model,
        { ...text("shutterCount", "Shutter Count", "e.g. 3,200"), ...shownFor("itemType", ["dslr", "mirrorless"]) },
        { ...text("lensMount", "Lens Mount", "e.g. Sony E, Canon RF"), ...shownFor("itemType", ["lens"]) },
        condition,
        warranty,
      ]);

    case "Computer Parts & Components":
      return forSale("Component", [
        select("itemType", "Component", PART_TYPES, { required: true }),
        brand,
        model,
        text("capacity", "Capacity / Spec", "e.g. 16GB, 2TB, 850W"),
        condition,
        warranty,
      ]);

    case "Wearables & Smart Devices":
      return forSale("Device", [
        itemType(WEARABLE_TYPES),
        brand,
        model,
        text("size", "Size", "e.g. 45mm, Ring size 9"),
        condition,
        warranty,
      ]);

    case "Tech Accessories":
      return forSale("Accessory", [
        itemType(ACCESSORY_TYPES),
        brand,
        text("compatibleWith", "Compatible With", "e.g. iPhone 15, USB-C laptops"),
        condition,
      ]);

    default:
      return null;
  }
}
