// scripts/backfill-pets-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-pets-seed-details.ts [--dry-run]
//
// One-off (2026-10-23): the Pets seed posts were copied from the mock catalog
// (lib/mock) with only a title and a price, so the reworked Pets search
// filters had nothing to match. This fills, from each post's mock listing
// (same id as the post's adsId), only what's empty, so it is safe to re-run.
// - For Sale / Adoption: Pet Type, Breed, Breed Type, Age Group, Exact Age,
//   Gender, Vaccination, Listed By, Microchipped, Neutered, Papers, Ready to
//   Leave, Available, House-trained, Good With
// - Pet Care: Service Type, Listed By, For Animals, Service Mode, Price Per,
//   Availability, Insured
// - Accessories: Category, For Animal, Condition, Size, Brand, Listed By
// - Lost & Found: Report Type, Pet Type, Pet Name, Breed, Color, Gender, Size,
//   Microchipped, Date, Location, and the seed's price moved to Reward (the
//   listing showed it as a reward; Lost & Found has no price filter)
// - Wanted: Looking To, Pet Type, Breed Preference, Breed Type, Size
//   Preference, and the seed's price moved to Budget (what its price filter reads)
// Also moves the one real pre-rework post ("Farm Animal Care & Boarding",
// subcategory "services") to Pet Care's "service" so Pets search shows it.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

/** Post model paths the Pets forms save top-level; anything else goes in `attributes`. */
type TopLevel = Partial<
  Record<
    | "petType" | "breed" | "age" | "gender" | "vaccination" | "size" | "serviceType" | "availability" | "condition"
    | "reportType" | "petName" | "color" | "lfDate" | "lastSeenLocation" | "wantedPetType" | "breedPreference" | "sizePreference",
    string
  >
>;
interface SeedDetails {
  fields: TopLevel;
  attributes: Record<string, unknown>;
  /** Move the seed's `salePrice` into this field ("reward" is saved in attributes). */
  moveSalePriceTo?: "budget" | "reward";
}

// Values are the Pets forms' (posting/form-schema/defaults/pets.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── For Sale
  "pet-in-sale-01": {
    fields: { petType: "dog", breed: "Labrador Retriever", age: "8 weeks", vaccination: "partial" },
    attributes: { listedBy: "breeder", breedType: "pure", ageGroup: "baby", papers: "yes" },
  },
  "pet-in-sale-02": {
    fields: { petType: "dog", breed: "Golden Retriever", age: "10 weeks" },
    attributes: { listedBy: "breeder", breedType: "pure", ageGroup: "baby" },
  },
  "pet-sale-01": {
    fields: { petType: "dog", breed: "Golden Retriever", age: "8 weeks", gender: "female", vaccination: "partial" },
    attributes: { listedBy: "breeder", breedType: "pure", ageGroup: "baby", papers: "yes", microchipped: "yes", readyDate: "Ready now", available: 2 },
  },
  "pet-sale-02": {
    fields: { petType: "cat", breed: "Bengal (F4)", age: "11 weeks", vaccination: "vaccinated" },
    attributes: { listedBy: "breeder", breedType: "pure", ageGroup: "baby", papers: "yes", microchipped: "yes" },
  },
  "pet-sale-03": {
    fields: { petType: "reptile", breed: "Bearded Dragon", age: "2 years", gender: "male" },
    attributes: { listedBy: "owner", ageGroup: "adult" },
  },
  "pet-sg-sale-01": {
    fields: { petType: "dog", breed: "Toy Poodle", age: "8 weeks", vaccination: "vaccinated" },
    attributes: { listedBy: "breeder", breedType: "pure", ageGroup: "baby", microchipped: "yes" },
  },
  "pet-sg-sale-02": {
    fields: { petType: "dog", breed: "Corgi", age: "10 weeks" },
    attributes: { listedBy: "breeder", breedType: "pure", ageGroup: "baby" },
  },

  // ── Adoption
  "pet-in-adopt-01": {
    fields: { petType: "dog", breed: "Indie Mix", age: "2 years" },
    attributes: { listedBy: "rescue", breedType: "mixed", ageGroup: "adult", neutered: "yes", houseTrained: "yes" },
  },
  "pet-in-adopt-02": {
    fields: { petType: "cat", breed: "Domestic Mix", age: "4 months" },
    attributes: { listedBy: "rescue", breedType: "mixed", ageGroup: "baby", houseTrained: "yes" },
  },
  "pet-adopt-01": {
    fields: { petType: "dog", breed: "Greyhound", age: "3 years", gender: "male", vaccination: "vaccinated" },
    attributes: { listedBy: "rescue", breedType: "pure", ageGroup: "adult", neutered: "yes", houseTrained: "yes", goodWith: ["children", "cats"] },
  },
  "pet-adopt-02": {
    fields: { petType: "cat", breed: "Tabby", age: "2 years", gender: "female", vaccination: "vaccinated" },
    attributes: { listedBy: "rescue", breedType: "mixed", ageGroup: "adult", neutered: "yes" },
  },
  "pet-adopt-03": {
    fields: { petType: "rabbit", age: "1.5 years", vaccination: "vaccinated" },
    attributes: { listedBy: "rescue", ageGroup: "young", neutered: "yes", microchipped: "yes" },
  },
  "pet-sg-adopt-01": {
    fields: { petType: "dog", breed: "Mixed Breed", age: "2 years" },
    attributes: { listedBy: "rescue", breedType: "mixed", ageGroup: "adult", neutered: "yes", houseTrained: "yes" },
  },
  "pet-sg-adopt-02": {
    fields: { petType: "cat", breed: "Domestic Mix", age: "4 months" },
    attributes: { listedBy: "rescue", breedType: "mixed", ageGroup: "baby", houseTrained: "yes" },
  },

  // ── Pet Care
  "pet-in-svc-01": {
    fields: { serviceType: "grooming" },
    attributes: { listedBy: "business", forAnimals: ["dog", "cat"], serviceMode: ["homevisit"], priceUnit: "session" },
  },
  "pet-in-svc-02": {
    fields: { serviceType: "vet" },
    attributes: { listedBy: "business", forAnimals: ["dog", "cat"], serviceMode: ["homevisit"], priceUnit: "visit" },
  },
  "pet-svc-01": {
    fields: { serviceType: "grooming", availability: "Mon–Sat by appointment" },
    attributes: { listedBy: "individual", forAnimals: ["dog"], serviceMode: ["homevisit"], priceUnit: "from", insured: "yes" },
  },
  "pet-svc-02": {
    fields: { serviceType: "boarding", availability: "365 days" },
    attributes: { listedBy: "individual", forAnimals: ["dog"], serviceMode: ["walkin"], priceUnit: "night" },
  },
  "pet-svc-03": {
    fields: { serviceType: "training", availability: "Weekday evenings + Saturday" },
    attributes: { listedBy: "business", forAnimals: ["dog"], serviceMode: ["walkin"], priceUnit: "session" },
  },
  "pet-sg-svc-01": {
    fields: { serviceType: "grooming" },
    attributes: { listedBy: "business", forAnimals: ["dog", "cat"], serviceMode: ["homevisit"], priceUnit: "session" },
  },
  "pet-sg-svc-02": {
    fields: { serviceType: "vet" },
    attributes: { listedBy: "business", forAnimals: ["dog", "cat"], serviceMode: ["homevisit"], priceUnit: "visit" },
  },

  // ── Accessories
  "pet-in-acc-01": { fields: { condition: "like_new", size: "large" }, attributes: { accessoryCategory: "housing", forAnimals: ["dog"], listedBy: "individual" } },
  "pet-in-acc-02": { fields: {}, attributes: { accessoryCategory: "toys", forAnimals: ["cat"], listedBy: "individual" } },
  "pet-acc-01": { fields: { condition: "like_new", size: "large" }, attributes: { accessoryCategory: "housing", forAnimals: ["dog"], listedBy: "individual" } },
  "pet-acc-02": { fields: { condition: "like_new" }, attributes: { accessoryCategory: "toys", forAnimals: ["cat"], listedBy: "individual" } },
  "pet-acc-03": { fields: { condition: "used" }, attributes: { accessoryCategory: "aquarium", forAnimals: ["fish"], brand: "Juwel", listedBy: "individual" } },
  "pet-sg-acc-01": { fields: { condition: "like_new", size: "large" }, attributes: { accessoryCategory: "housing", forAnimals: ["dog"], listedBy: "individual" } },
  "pet-sg-acc-02": { fields: {}, attributes: { accessoryCategory: "toys", forAnimals: ["cat"], listedBy: "individual" } },

  // ── Lost & Found
  "pet-in-lost-01": {
    fields: { reportType: "lost", petType: "dog", breed: "Beagle", lastSeenLocation: "100ft Road, Indiranagar" },
    attributes: {},
    moveSalePriceTo: "reward",
  },
  "pet-in-lost-02": {
    fields: { reportType: "found", petType: "cat", color: "Grey tabby", lastSeenLocation: "HAL 2nd Stage" },
    attributes: {},
    moveSalePriceTo: "reward",
  },
  "pet-lost-01": {
    fields: { reportType: "lost", petType: "cat", color: "Black and white", gender: "male", lfDate: "2026-06-24", lastSeenLocation: "Balham SW12" },
    attributes: { microchipped: "yes" },
    moveSalePriceTo: "reward",
  },
  "pet-lost-02": {
    fields: { reportType: "found", petType: "dog", breed: "Terrier mix", color: "Brown", size: "small", lfDate: "2026-06-25", lastSeenLocation: "Wandsworth Common SW18" },
    attributes: { microchipped: "unknown" },
    moveSalePriceTo: "reward",
  },
  "pet-lost-03": {
    fields: { reportType: "lost", petType: "bird", petName: "Monty", breed: "African Grey Parrot", lfDate: "2026-06-23", lastSeenLocation: "Islington N1" },
    attributes: {},
    moveSalePriceTo: "reward",
  },
  "pet-sg-lost-01": {
    fields: { reportType: "lost", petType: "dog", breed: "Beagle", lastSeenLocation: "Tampines Street 81" },
    attributes: {},
    moveSalePriceTo: "reward",
  },
  "pet-sg-lost-02": {
    fields: { reportType: "found", petType: "cat", color: "Grey tabby", lastSeenLocation: "Tampines Central" },
    attributes: {},
    moveSalePriceTo: "reward",
  },

  // ── Wanted
  "pet-in-want-01": {
    fields: { wantedPetType: "dog", breedPreference: "Pug / Shih Tzu", sizePreference: "small" },
    attributes: { lookingTo: "buy", breedType: "pure" },
    moveSalePriceTo: "budget",
  },
  "pet-in-want-02": { fields: { wantedPetType: "other" }, attributes: { lookingTo: "care" }, moveSalePriceTo: "budget" },
  "pet-want-01": {
    fields: { wantedPetType: "dog", breedPreference: "Shih Tzu / Cavalier / Bichon", sizePreference: "small" },
    attributes: { lookingTo: "buy", breedType: "pure" },
    moveSalePriceTo: "budget",
  },
  "pet-want-02": { fields: { wantedPetType: "rabbit" }, attributes: { lookingTo: "adopt", breedType: "any" }, moveSalePriceTo: "budget" },
  "pet-want-03": { fields: { wantedPetType: "fish" }, attributes: { lookingTo: "accessories" }, moveSalePriceTo: "budget" },
  "pet-sg-want-01": {
    fields: { wantedPetType: "dog", breedPreference: "Pomeranian / Shih Tzu", sizePreference: "small" },
    attributes: { lookingTo: "buy", breedType: "pure" },
    moveSalePriceTo: "budget",
  },
  "pet-sg-want-02": { fields: { wantedPetType: "other" }, attributes: { lookingTo: "care" }, moveSalePriceTo: "budget" },
};

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "pets", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};
    for (const [key, value] of Object.entries(details.fields)) {
      if (doc[key] == null || doc[key] === "") $set[key] = value;
    }
    for (const [key, value] of Object.entries(details.attributes)) {
      if (post.attributes?.[key] == null) $set[`attributes.${key}`] = value;
    }
    if (details.moveSalePriceTo && post.salePrice != null) {
      const target = details.moveSalePriceTo === "reward" ? "attributes.reward" : "budget";
      // A found pet's 0 was "no reward", not a reward of 0.
      if (post.salePrice > 0) $set[target] = post.salePrice;
      $unset.salePrice = "";
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    const update = { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) };
    console.log(`${id} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify(update)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, update);
  }

  // "Farm Animal Care & Boarding" was saved under "services", which no Pets
  // search reads; Pet Care's subcategory is "service".
  const strays = await Post.find({ category: "pets", subcategory: "services" }).select({ _id: 1, name: 1, serviceType: 1, attributes: 1 }).lean();
  for (const post of strays) {
    const $set: Record<string, unknown> = { subcategory: "service" };
    if (post.serviceType === "Animal Boarding") $set.serviceType = "boarding";
    if (post.attributes?.forAnimals == null) $set["attributes.forAnimals"] = ["other"];
    console.log(`${post.name} ${post._id}: ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
