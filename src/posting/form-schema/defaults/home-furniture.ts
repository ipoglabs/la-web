// Default "Home & Furniture" post-form schemas.
//
// Option values are what the Home & Furniture search filters match
// (components/create-alert/config/home-furniture.ts, lib/postFilterQuery.ts
// HOME_FORM_FILTERS). The price is `salePrice`, the field listing prices and
// the price filter read. Every sub asks its Type as `itemType`.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

/** The marketplace's graded condition scale (defaults/marketplace.ts). */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];

const select = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "select",
  label,
  options: pairs(entries),
  width: "half",
  ...extra,
});
const text = (key: string, label: string, placeholder?: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const yesNo = (key: string, label: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half", ...extra });
const itemType = (entries: [string, string][], label = "Type"): FormFieldDef => select("itemType", label, entries, { required: true, width: "full" });
const shownFor = (types: string[]) => ({ showWhen: { field: "itemType", in: types } });

const condition = select("condition", "Condition", CONDITION_SCALE, { required: true });
const brand = text("brand", "Brand");
const model = text("model", "Model");
const material = text("material", "Material");
const colour = text("color", "Colour", "e.g. Light grey");
const dimensions = text("dimensions", "Dimensions", "e.g. 180 x 90 x 75 cm");
const assembly = select("assembly", "Assembly", [["assembled", "Assembled"], ["flatpack", "Flat-packed"], ["dismantle", "Needs dismantling"]]);
const warranty = select("warranty", "Warranty", [["no", "No Warranty"], ["under-warranty", "Under Warranty"], ["extended", "Extended Warranty"]]);
const seats = (entries: string[], extra: Partial<FormFieldDef> = {}): FormFieldDef =>
  select("seats", "Seats", entries.map((v) => [v, v.replace("plus", "+")]), extra);
const powerSource = (corded: string, types: string[]): FormFieldDef =>
  select("powerSource", "Power Source", [["petrol", "Petrol"], ["corded", corded], ["cordless", "Cordless (Battery)"], ["manual", "Manual"]], shownFor(types));

/** Bed and mattress sizes in each market's own terms. */
const BED_SIZES: Record<string, [string, string][]> = {
  IN: [["single", "Single"], ["double", "Double"], ["queen", "Queen"], ["king", "King"]],
  GB: [["single", "Single"], ["small_double", "Small Double"], ["double", "Double"], ["king", "King"], ["super_king", "Super King"]],
  SG: [["single", "Single"], ["super_single", "Super Single"], ["queen", "Queen"], ["king", "King"]],
};
/** Appliance energy labels: UK A–G, India BEE stars, Singapore NEA ticks. */
const ENERGY_RATINGS: Record<string, { label: string; options: [string, string][] }> = {
  GB: { label: "Energy Rating", options: ["A", "B", "C", "D", "E", "F", "G"].map((g) => [g.toLowerCase(), g]) },
  IN: { label: "Energy Rating (BEE)", options: [1, 2, 3, 4, 5].map((n) => [String(n), `${n} Star`]) },
  SG: { label: "Energy Label (NEA)", options: [1, 2, 3, 4, 5].map((n) => [String(n), `${n} Tick${n > 1 ? "s" : ""}`]) },
};
const BIG_APPLIANCES = ["fridge", "washing", "dryer", "dishwasher", "ac"];

const priceSection: FormSection = {
  title: "Price & Delivery",
  fields: [
    { key: "salePrice", type: "currency", label: "Price", required: true, min: 1, width: "half" },
    yesNo("negotiable", "Negotiable"),
    { key: "dealMethod", type: "multiselect", label: "Deal Method", options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]) },
  ],
};

export function homeFurnitureSections(subcategory: string, country: string): FormSection[] | null {
  const item = (fields: FormFieldDef[]): FormSection[] => [basics, { title: "Item", fields }, priceSection];

  switch (subcategory) {
    case "Sofas & Seating":
      return item([
        itemType([["sofa", "Sofa"], ["corner", "Corner Sofa"], ["sofa_bed", "Sofa Bed"], ["armchair", "Armchair"], ["recliner", "Recliner"], ["footstool", "Footstool & Ottoman"], ["bench", "Bench"], ["other", "Other"]]),
        seats(["1", "2", "3", "4", "5plus"]),
        select("upholstery", "Upholstery", [["fabric", "Fabric"], ["leather", "Leather"], ["faux_leather", "Faux Leather"], ["velvet", "Velvet"], ["other", "Other"]]),
        condition,
        brand,
        colour,
        dimensions,
        assembly,
        yesNo("petSmokeFree", "Pet & Smoke Free Home"),
      ]);

    case "Beds & Bedroom": {
      const beds = ["bed_frame", "mattress", "bed_mattress"];
      return item([
        itemType(
          [["bed_frame", "Bed Frame"], ["mattress", "Mattress"], ["bed_mattress", "Bed with Mattress"], ["wardrobe", "Wardrobe"], ["drawers", "Chest of Drawers"], ["bedside", "Bedside Table"], ["dressing", "Dressing Table"], ["other", "Other"]],
          "Item Type",
        ),
        select("bedSize", "Bed Size", BED_SIZES[country] ?? BED_SIZES.IN, { required: true, ...shownFor(beds) }),
        select(
          "mattressType",
          "Mattress Type",
          [["memory_foam", "Memory Foam"], ["pocket_sprung", "Pocket Sprung"], ["latex", "Latex"], ...(country === "IN" ? [["coir", "Coir"] as [string, string]] : []), ["other", "Other"]],
          shownFor(["mattress", "bed_mattress"]),
        ),
        yesNo("storageBed", "Storage Bed", shownFor(["bed_frame", "bed_mattress"])),
        condition,
        brand,
        material,
        dimensions,
        assembly,
      ]);
    }

    case "Tables, Desks & Dining":
      return item([
        itemType([["dining", "Dining Table"], ["dining_set", "Dining Set (Table + Chairs)"], ["desk", "Desk"], ["coffee", "Coffee Table"], ["side", "Side Table"], ["chairs", "Dining Chairs"], ["office_chair", "Office Chair"], ["other", "Other"]]),
        seats(["2", "4", "6", "8plus"], shownFor(["dining", "dining_set"])),
        yesNo("heightAdjustable", "Height Adjustable", shownFor(["desk"])),
        condition,
        brand,
        material,
        dimensions,
        assembly,
      ]);

    case "Kitchen & Appliances": {
      const energy = ENERGY_RATINGS[country] ?? ENERGY_RATINGS.IN;
      return item([
        itemType([
          ["fridge", "Fridge & Freezer"],
          ["washing", "Washing Machine"],
          ["dryer", "Tumble Dryer"],
          ["dishwasher", "Dishwasher"],
          ["microwave", "Microwave & Oven"],
          ["cooker", "Hob & Cooker"],
          ["ac", "Air Conditioner"],
          ...(country === "GB" ? [] : [["purifier", "Water Purifier"] as [string, string]]),
          ["vacuum", "Vacuum & Air Purifier"],
          ["small", "Small Kitchen Appliances"],
          ["cookware", "Cookware & Kitchenware"],
          ["other", "Other"],
        ]),
        condition,
        brand,
        model,
        select("energyRating", energy.label, energy.options, shownFor(BIG_APPLIANCES)),
        text("capacity", "Capacity", "e.g. 300 L, 8 kg, 1.5 ton"),
        dimensions,
        warranty,
      ]);
    }

    case "Storage & Shelving":
      return item([
        itemType([["bookcase", "Bookcase & Shelving"], ["cube", "Cube Unit"], ["cabinet", "Cabinet & Sideboard"], ["tv", "TV Unit"], ["shoe", "Shoe Rack"], ["rack", "Rack & Utility Shelving"], ["box", "Storage Boxes"], ["other", "Other"]]),
        condition,
        brand,
        colour,
        material,
        dimensions,
        assembly,
        { key: "quantity", type: "number", label: "Number of Units", min: 1, width: "half" },
      ]);

    case "Home Decor & Accessories":
      return item([
        itemType([
          ["rugs", "Rugs & Carpets"],
          ["curtains", "Curtains & Blinds"],
          ["art", "Wall Art & Prints"],
          ["mirrors", "Mirrors"],
          ["cushions", "Cushions & Throws"],
          ["lighting", "Lamps & Lighting"],
          ["vases", "Vases & Ornaments"],
          ["clocks", "Clocks"],
          ["plants", "Indoor Plants & Pots"],
          ["festive", "Festive & Seasonal"],
          ["other", "Other"],
        ]),
        select("soldAs", "Sold As", [["single", "Single"], ["pair", "Pair"], ["set", "Set"]]),
        condition,
        brand,
        colour,
        material,
        dimensions,
      ]);

    case "Garden & Outdoor":
      return item([
        itemType([["furniture", "Garden Furniture"], ["bbq", "BBQ & Grills"], ["power", "Lawnmowers & Power Tools"], ["hand", "Hand Tools"], ["plants", "Plants & Seeds"], ["pots", "Pots & Planters"], ["sheds", "Sheds & Storage"], ["decking", "Decking & Fencing"], ["other", "Other"]]),
        powerSource("Corded Electric", ["power"]),
        select("bbqFuel", "BBQ Fuel", [["charcoal", "Charcoal"], ["gas", "Gas"], ["electric", "Electric"]], shownFor(["bbq"])),
        seats(["2", "4", "6", "8plus"], shownFor(["furniture"])),
        condition,
        brand,
        material,
        dimensions,
      ]);

    case "DIY, Tools & Hardware":
      return item([
        itemType([
          ["power", "Power Tools"],
          ["hand", "Hand Tools"],
          ["measuring", "Measuring & Levelling"],
          ["ladders", "Ladders & Access"],
          ["plumbing", "Plumbing"],
          ["electric", "Electrical"],
          ["flooring", "Flooring & Tiles"],
          ["paint", "Paint & Decorating"],
          ["materials", "Building Materials"],
          ["other", "Other"],
        ]),
        powerSource("Corded", ["power"]),
        select("batteries", "Batteries & Charger", [["included", "Included"], ["tool_only", "Tool only"]], { showWhen: { field: "powerSource", in: ["cordless"] } }),
        condition,
        brand,
        model,
        { ...text("amount", "Amount", "e.g. 12 m², 20 tiles, 5 L"), ...shownFor(["flooring", "paint", "materials"]) },
        warranty,
      ]);

    default:
      return null;
  }
}
