// src/app/actions/addPost.ts
"use server";

import connectDB from "../../config/database";
import Post from "../../models/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

// ✅ add a type for location
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
  // ✅ parse with a typed fallback so TS knows about `address`
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

  // --- Optional fields (mostly strings/numbers/arrays) ---
  const facilities = pullArray(formData.get("facilities"));
  const amenities = pullArray(formData.get("amenities"));

  const postData = {
    category,
    subcategory,
    name,
    description,
    location,          // ✅ typed LocationData
    seller_info,
    images,

    // common property
    propertyType: pullString(formData.get("propertyType")),
    beds: pullNumber(formData.get("beds")),
    baths: pullNumber(formData.get("baths")),
    rentPrice: pullNumber(formData.get("rentPrice")),
    salePrice: pullNumber(formData.get("salePrice")),
    deposit: pullNumber(formData.get("deposit")),
    occupancy: pullString(formData.get("occupancy")),
    gender_pref: pullString(formData.get("gender_pref")),
    facilities,
    amenities,

    // commercial extras
    builtup_area: pullNumber(formData.get("builtup_area")),
    carpet_area: pullNumber(formData.get("carpet_area")),
    floor: pullNumber(formData.get("floor")),
    totalFloors: pullNumber(formData.get("totalFloors")),
    furnishing: pullString(formData.get("furnishing")),
    washrooms: pullNumber(formData.get("washrooms")),
    pantry: pullString(formData.get("pantry")),
    parkingSpaces: pullNumber(formData.get("parkingSpaces")),
    maintenance: pullNumber(formData.get("maintenance")),
    available_from: pullString(formData.get("available_from")),
    leaseTerm: pullNumber(formData.get("leaseTerm")),
    powerBackup: pullString(formData.get("powerBackup")),
  };

  // --- Validate required fields ---
  const errors: string[] = [];
  if (!postData.name) errors.push("Title (name) is required");
  if (!postData.description) errors.push("Description is required");
  if (!postData.category) errors.push("Category is required");
  if (!postData.subcategory) errors.push("Subcategory is required");
  // ✅ validate against the typed `location` (or keep `postData.location as LocationData`)
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

// ------- helpers -------
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
