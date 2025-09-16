// src/app/actions/addPost.ts
"use server";

import connectDB from "../../config/database";
import Post from "../../models/post";
import cloudinary from "@/config/cloudinary";

type LocationData = { address?: string; lat?: number; lng?: number };

export async function addPost(formData: FormData): Promise<
  | { ok: true; id: string }
  | { ok: false; error: string }
> {
  try {
    await connectDB();

    // --- Parse core fields (add fallbacks for job forms) ---
    const name =
      ((formData.get("name") as string) ?? "").trim() ||
      ((formData.get("jobTitle") as string) ?? "").trim() ||
      ((formData.get("projectTitle") as string) ?? "").trim();

    const description =
      ((formData.get("description") as string) ?? "").trim();

    const category = ((formData.get("category") as string) ?? "").trim();
    const subcategory = ((formData.get("subcategory") as string) ?? "").trim();

    // locationData must be JSON string in the client
    const locationRaw = (formData.get("locationData") as string) || "";
    const location: LocationData = locationRaw ? safeParse<LocationData>(locationRaw, {}) : {};

    const seller_info = {
      name: ((formData.get("seller_info.name") as string) || "").trim(),
      email: ((formData.get("seller_info.email") as string) || "").trim(),
      phone: ((formData.get("seller_info.phone") as string) || "").trim(),
    };

    // --- Images: URLs + Files ---
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
      } catch (e) {
        console.error("Cloudinary upload failed:", e);
      }
    }

    // --- Helpers: read typed primitives/arrays ---
    const pullString = (v: FormDataEntryValue | null | undefined) => {
      const s = (v as string | null) ?? "";
      const t = s?.trim?.() ?? s;
      return t || undefined;
    };
    const pullNumber = (v: FormDataEntryValue | null | undefined) => {
      const s = pullString(v);
      if (!s) return undefined;
      const n = Number(s);
      return Number.isNaN(n) ? undefined : n;
    };
    const pullArray = (v: FormDataEntryValue | null | undefined) => {
      const s = pullString(v);
      if (!s) return [];
      const parsed = safeParse<any>(s, []);
      return Array.isArray(parsed) ? parsed : [];
    };

    // --- Property fields (kept as before) ---
    const facilities = pullArray(formData.get("facilities"));
    const amenities = pullArray(formData.get("amenities"));

    // --- Build postData (property + job superset) ---
    const postData: Record<string, any> = {
      // core
      category,
      subcategory,
      name,
      description,
      location,
      seller_info,
      images,

      // property common
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

      // holiday rental
      holidayType: pullString(formData.get("holidayType")),
      guests: pullNumber(formData.get("guests")),
      house_rules: pullArray(formData.get("house_rules")),
      rateNightly: pullNumber(formData.get("rateNightly")),
      rateWeekly: pullNumber(formData.get("rateWeekly")),
      rateMonthly: pullNumber(formData.get("rateMonthly")),

      // room rental
      type: pullString(formData.get("type")),
      rent: pullNumber(formData.get("rent")),
      preferred_tenants: pullString(formData.get("preferred_tenants")),
      rules: pullArray(formData.get("rules")),

      // for sale extras
      plot_area: pullNumber(formData.get("plot_area")),
      negotiable: pullString(formData.get("negotiable")),
      ownership: pullString(formData.get("ownership")),
      age: pullString(formData.get("age")),

      // ===== Job fields =====
      company: pullString(formData.get("company")),
      clientName: pullString(formData.get("clientName")),
      jobType: pullString(formData.get("jobType")),           // "Full Time" etc.
      workMode: pullString(formData.get("workMode")),         // onsite/remote/hybrid
      salary: pullNumber(formData.get("salary")),
      hourlyRate: pullNumber(formData.get("hourlyRate")),
      stipendType: pullString(formData.get("stipendType")),   // internship
      stipendAmount: pullNumber(formData.get("stipendAmount")),
      startDate: pullString(formData.get("startDate")),
      endDate: pullString(formData.get("endDate")),
      duration: pullString(formData.get("duration")),
      contractDuration: pullString(formData.get("contractDuration")),
      workingHours: pullString(formData.get("workingHours")),
      deadline: pullString(formData.get("deadline")),
      applyLink: pullString(formData.get("applyLink")),
      projectType: pullString(formData.get("projectType")),   // freelance
      budgetType: pullString(formData.get("budgetType")),
      budgetAmount: pullNumber(formData.get("budgetAmount")),
      experience: pullString(formData.get("experience")),
      skills: pullArray(formData.get("skills")),
      benefits: pullArray(formData.get("benefits")),
      shifts: pullArray(formData.get("shifts")),
      candidateName: pullString(formData.get("candidateName")),
      preferred_locations: pullArray(formData.get("preferred_locations")),
    };

    // --- Required checks (don’t throw; return message) ---
    const errors: string[] = [];
    if (!postData.name) errors.push("Title (name/jobTitle/projectTitle) is required");
    if (!postData.description) errors.push("Description is required");
    if (!postData.category) errors.push("Category is required");
    if (!postData.subcategory) errors.push("Subcategory is required");
    if (!location?.address) errors.push("Location address is required");
    if (!postData.seller_info?.name) errors.push("Contact name is required");
    if (!postData.seller_info?.email) errors.push("Contact email is required");
    if (!postData.seller_info?.phone) errors.push("Contact phone is required");

    if (errors.length) {
      console.error("Validation errors:", errors, { postData });
      return { ok: false, error: errors.join(" • ") };
    }

    console.log("Saving Post with data:", postData);

    const newPost = new Post(postData);
    await newPost.save();

    return { ok: true, id: String(newPost._id) };
  } catch (e: any) {
    console.error("addPost fatal error:", e);
    // include e.message if present; fall back to generic
    return { ok: false, error: e?.message || "Unknown server error in addPost" };
  }
}

function safeParse<T = any>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}