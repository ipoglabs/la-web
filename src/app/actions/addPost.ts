// src/app/actions/addPost.ts
"use server";

import connectDB from "../../config/database";
import Post from "../../models/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

// Typed location so TS knows about "address"
type LocationData = {
  address?: string;
  lat?: number;
  lng?: number;
};

export async function addPost(formData: FormData) {
  await connectDB();

  // --- Parse core fields ---
  const category = (formData.get("category") as string)?.trim() || "";
  const subcategory = (formData.get("subcategory") as string)?.trim() || "";
  const name = (formData.get("name") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";

  // locationData is expected to be a JSON string
  const locationRaw = (formData.get("locationData") as string) || "";
  const location: LocationData = locationRaw
    ? safeParse<LocationData>(locationRaw, {})
    : {};

  const seller_info = {
    name: ((formData.get("seller_info.name") as string) || "").trim(),
    email: ((formData.get("seller_info.email") as string) || "").trim(),
    phone: ((formData.get("seller_info.phone") as string) || "").trim(),
  };

  // --- Collect images (urls + files) ---
  const imageUrlEntries = (formData.getAll("imageUrl") as string[]) || [];
  const imageFiles = (formData.getAll("images") as File[]) || [];
  const images: string[] = [...imageUrlEntries];

  for (const file of imageFiles) {
    if (!(file instanceof File) || !file.size || !file.type?.startsWith("image/")) continue;
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(new Uint8Array(buffer)).toString("base64");
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        { folder: "posts" }
      );
      images.push(result.secure_url);
    } catch (uploadErr) {
      console.error("❌ Cloudinary upload failed:", uploadErr);
    }
  }

  // --- Optional fields (strings/numbers/arrays) ---
  const facilities = pullArray(formData.get("facilities"));
  const amenities  = pullArray(formData.get("amenities"));
  const house_rules = pullArray(formData.get("house_rules")); // room/holiday

  const postData = {
    // required core
    category,
    subcategory,
    name,
    description,
    location,
    seller_info,
    images,

    // common property
    propertyType:  pullString(formData.get("propertyType")),
    beds:          pullNumber(formData.get("beds")),
    baths:         pullNumber(formData.get("baths")),
    rentPrice:     pullNumber(formData.get("rentPrice")),
    salePrice:     pullNumber(formData.get("salePrice")),
    deposit:       pullNumber(formData.get("deposit")),
    occupancy:     pullString(formData.get("occupancy")),
    gender_pref:   pullString(formData.get("gender_pref")),
    facilities,
    amenities,

    // commercial extras
    builtup_area:  pullNumber(formData.get("builtup_area")),
    carpet_area:   pullNumber(formData.get("carpet_area")),
    floor:         pullNumber(formData.get("floor")),
    totalFloors:   pullNumber(formData.get("totalFloors")),
    furnishing:    pullString(formData.get("furnishing")),
    washrooms:     pullNumber(formData.get("washrooms")),
    pantry:        pullString(formData.get("pantry")),
    parkingSpaces: pullNumber(formData.get("parkingSpaces")),
    maintenance:   pullNumber(formData.get("maintenance")),
    available_from: pullString(formData.get("available_from")), // keep as string unless you switch to Date
    leaseTerm:     pullNumber(formData.get("leaseTerm")),
    powerBackup:   pullString(formData.get("powerBackup")),

    // holiday rental extras (match your form/config)
    holidayType:   pullString(formData.get("holidayType")),
    guests:        pullNumber(formData.get("guests")),
    rateNightly:   pullNumber(formData.get("rateNightly")),
    rateWeekly:    pullNumber(formData.get("rateWeekly")),
    rateMonthly:   pullNumber(formData.get("rateMonthly")),
    house_rules,

    minBudget: pullNumber(formData.get("minBudget")),
maxBudget: pullNumber(formData.get("maxBudget")),
minArea:   pullNumber(formData.get("minArea")),
preferred_locations: pullArray(formData.get("preferred_locations")),

    // for sale extras
    plot_area:     pullNumber(formData.get("plot_area")),
    negotiable:    pullString(formData.get("negotiable")),   // "Yes"/"No"
    ownership:     pullString(formData.get("ownership")),
    age:           pullString(formData.get("age")),

    // --- Job (Full Time) fields ---
jobType:    pullString(formData.get("jobType")),
company:    pullString(formData.get("company")),
salary:     pullNumber(formData.get("salary")),
experience: pullString(formData.get("experience")),
skills:     pullArray(formData.get("skills")),
benefits:   pullArray(formData.get("benefits")),
workMode:   pullString(formData.get("workMode")),

// --- Job (part-time & common) ---
hourlyRate: pullNumber(formData.get("hourlyRate")),
shifts:     pullArray(formData.get("shifts")),
employmentType: pullString(formData.get("employmentType")), // "Part Time"
applyLink:  pullString(formData.get("applyLink")),
deadline:   pullString(formData.get("deadline")),

// --- Job (internship & common) ---
duration:       pullString(formData.get("duration")),
startDate:      pullString(formData.get("startDate")),
stipendType:    pullString(formData.get("stipendType")),
stipend:        pullNumber(formData.get("stipend")),

// --- Job (freelance & common) ---
projectType:    pullString(formData.get("projectType")),
budgetType:     pullString(formData.get("budgetType")),   // "fixed" | "hourly"
budgetAmount:   pullNumber(formData.get("budgetAmount")), 

// --- Job (temporary) ---
workingHours:   pullString(formData.get("workingHours")),
endDate:        pullString(formData.get("endDate")), // "Temporary"

// --- Job Wanted ---
candidateName:     pullString(formData.get("candidateName")),


  };

  // --- Validate required fields ---
  const errors: string[] = [];
  if (!postData.name) errors.push("Title (name) is required");
  if (!postData.description) errors.push("Description is required");
  if (!postData.category) errors.push("Category is required");
  if (!postData.subcategory) errors.push("Subcategory is required");
  if (!location.address) errors.push("Location address is required");
  if (!postData.seller_info?.name) errors.push("Contact name is required");
  if (!postData.seller_info?.email) errors.push("Contact email is required");
  if (!postData.seller_info?.phone) errors.push("Contact phone is required");

  if (errors.length) {
    console.error("❌ Validation errors:", errors, { postData });
    throw new Error(errors.join(" • "));
  }

  console.log("🧩 Saving Post with data:", postData);

  const newPost = new Post(postData);
  await newPost.save();

  revalidatePath("/", "layout");
  redirect(`/post-details/${newPost._id}`);
}

/* ---------------- helpers ---------------- */
function safeParse<T = any>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function pullString(v: FormDataEntryValue | null | undefined) {
  const s = (v as string | null) ?? "";
  const t = s.trim?.() ?? s;
  return t || undefined;
}

function pullNumber(v: FormDataEntryValue | null | undefined) {
  const s = pullString(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}

function pullArray(v: FormDataEntryValue | null | undefined) {
  const s = pullString(v);
  if (!s) return [];
  const parsed = safeParse<any>(s, []);
  return Array.isArray(parsed) ? parsed : [];
}
