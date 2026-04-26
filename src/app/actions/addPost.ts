"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { generateAdsId } from "@/lib/generateAdsId";
import cloudinary from "@/config/cloudinary";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";

type LocationData = {
  address?: string;
  lat?: number;
  lng?: number;
};

function safeParse<T = unknown>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

const pullString = (v: FormDataEntryValue | null | undefined): string | undefined => {
  const s = typeof v === "string" ? v : "";
  const t = s.trim();
  return t || undefined;
};

const pullNumber = (v: FormDataEntryValue | null | undefined): number | undefined => {
  const s = pullString(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
};

const pullArray = (v: FormDataEntryValue | null | undefined): string[] => {
  const s = pullString(v);
  if (!s) return [];

  const parsed = safeParse<unknown>(s, []);
  if (Array.isArray(parsed)) {
    return parsed.map((x) => String(x).trim()).filter(Boolean);
  }

  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

function normalizeEmail(e?: string): string | undefined {
  return e ? String(e).trim().toLowerCase() : undefined;
}

function getCountryCodeFromLocation(location: LocationData): string {
  const address = location?.address?.toLowerCase() || "";

  if (address.includes("india")) return "IND";
  if (address.includes("singapore")) return "SG";
  if (
    address.includes("uae") ||
    address.includes("united arab emirates") ||
    address.includes("dubai") ||
    address.includes("abu dhabi")
  ) {
    return "UAE";
  }

  return "GLB";
}

function getCountryCode(formData: FormData, location: LocationData): string {
  const explicitCountry =
    pullString(formData.get("country")) ||
    pullString(formData.get("countryCode"));

  if (explicitCountry) {
    return explicitCountry.toUpperCase();
  }

  return getCountryCodeFromLocation(location);
}

async function uploadImages(formData: FormData): Promise<string[]> {
  const imageUrlEntries = formData
    .getAll("imageUrl")
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  const imageFiles = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File);

  const uploadedImages = await Promise.all(
    imageFiles.map(async (file) => {
      if (!file.size || !file.type?.startsWith("image/")) return null;

      try {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(new Uint8Array(buffer)).toString("base64");

        const result = await cloudinary.uploader.upload(
          `data:${file.type};base64,${base64}`,
          { folder: "posts" }
        );

        return result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
      }
    })
  );

  return [...imageUrlEntries, ...uploadedImages.filter(Boolean)];
}

export async function addPost(
  formData: FormData
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    await connectDB();

    const session = await getSession();

    if (!session || !session.userId) {
      return { ok: false, error: "Unauthorized user" };
    }

    if (!mongoose.Types.ObjectId.isValid(session.userId)) {
      return { ok: false, error: "Invalid userId" };
    }

    const ownerId = new mongoose.Types.ObjectId(session.userId);
    const ownerEmail = normalizeEmail(session.email);

    const name =
      pullString(formData.get("name")) ||
      pullString(formData.get("jobTitle")) ||
      pullString(formData.get("projectTitle"));

    const description = pullString(formData.get("description"));
    const category = pullString(formData.get("category"));
    const subcategory = pullString(formData.get("subcategory"));

    const locationRaw = (formData.get("locationData") as string) || "";
    const location: LocationData = locationRaw
      ? safeParse<LocationData>(locationRaw, {})
      : {};

    const seller_info = {
      name:
        pullString(formData.get("seller_info.name")) ||
        pullString(formData.get("sellerInfo.name")) ||
        "",
      email:
        normalizeEmail(
          pullString(formData.get("seller_info.email")) ||
            pullString(formData.get("sellerInfo.email"))
        ) ||
        ownerEmail ||
        "",
      phone:
        pullString(formData.get("seller_info.phone")) ||
        pullString(formData.get("sellerInfo.phone")) ||
        "",
    };

    const images = await uploadImages(formData);

    const facilities = pullArray(formData.get("facilities"));
    const amenities = pullArray(formData.get("amenities"));

    const postData = {
      ownerId,
      category,
      subcategory,
      name,
      description,
      location,
      seller_info,
      images,
      facilities,
      amenities,

      // Property / Commercial
      propertyType: pullString(formData.get("propertyType")),
      beds: pullNumber(formData.get("beds")),
      baths: pullNumber(formData.get("baths")),
      rentPrice: pullNumber(formData.get("rentPrice")),
      salePrice: pullNumber(formData.get("salePrice")),
      deposit: pullNumber(formData.get("deposit")),
      occupancy: pullString(formData.get("occupancy")),
      gender_pref: pullString(formData.get("gender_pref")),
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

      // Holiday
      holidayType: pullString(formData.get("holidayType")),
      guests: pullNumber(formData.get("guests")),
      house_rules: pullArray(formData.get("house_rules")),
      rateNightly: pullNumber(formData.get("rateNightly")),
      rateWeekly: pullNumber(formData.get("rateWeekly")),
      rateMonthly: pullNumber(formData.get("rateMonthly")),

      // Room rental
      type: pullString(formData.get("type")),
      rent: pullNumber(formData.get("rent")),
      preferred_tenants: pullString(formData.get("preferred_tenants")),
      rules: pullArray(formData.get("rules")),

      // Sale extras
      plot_area: pullNumber(formData.get("plot_area")),
      negotiable: pullString(formData.get("negotiable")),
      ownership: pullString(formData.get("ownership")),
      age: pullString(formData.get("age")),

      // Jobs
      company: pullString(formData.get("company")),
      clientName: pullString(formData.get("clientName")),
      jobType: pullString(formData.get("jobType")),
      workMode: pullString(formData.get("workMode")),
      salary: pullNumber(formData.get("salary")),
      hourlyRate: pullNumber(formData.get("hourlyRate")),
      stipendType: pullString(formData.get("stipendType")),
      stipendAmount: pullNumber(formData.get("stipendAmount")),
      startDate: pullString(formData.get("startDate")),
      endDate: pullString(formData.get("endDate")),
      duration: pullString(formData.get("duration")),
      contractDuration: pullString(formData.get("contractDuration")),
      workingHours: pullString(formData.get("workingHours")),
      deadline: pullString(formData.get("deadline")),
      applyLink: pullString(formData.get("applyLink")),
      projectType: pullString(formData.get("projectType")),
      budgetType: pullString(formData.get("budgetType")),
      budgetAmount: pullNumber(formData.get("budgetAmount")),
      experience: pullString(formData.get("experience")),
      skills: pullArray(formData.get("skills")),
      benefits: pullArray(formData.get("benefits")),
      shifts: pullArray(formData.get("shifts")),
      candidateName: pullString(formData.get("candidateName")),
      preferred_locations: pullArray(formData.get("preferred_locations")),
      minBudget: pullNumber(formData.get("minBudget")),
      maxBudget: pullNumber(formData.get("maxBudget")),
      minArea: pullNumber(formData.get("minArea")),

      // Vehicles
      make: pullString(formData.get("make")),
      model: pullString(formData.get("model")),
      year: pullNumber(formData.get("year")),
      kms: pullNumber(formData.get("kms")),
      fuelType: pullString(formData.get("fuelType")),
      transmission: pullString(formData.get("transmission")),
      bodyType: pullString(formData.get("bodyType")),
      color: pullString(formData.get("color")),
      condition: pullString(formData.get("condition")),
      ownerType: pullString(formData.get("ownerType")),
      registrationNumber: pullString(formData.get("registrationNumber")),
      insuranceValidTill: pullString(formData.get("insuranceValidTill")),
      serviceHistory: pullString(formData.get("serviceHistory")),
      features: pullArray(formData.get("features")),
      engineCapacity: pullNumber(formData.get("engineCapacity")),
      seatingCapacity: pullNumber(formData.get("seatingCapacity")),

      // Parts (Vehicles)
      partsCategory: pullString(formData.get("partsCategory")),
      brand: pullString(formData.get("brand")),
      compatibility: pullArray(formData.get("compatibility")),

      // Pets: Adoption
      petName: pullString(formData.get("petName")),
      petType: pullString(formData.get("petType")),
      breed: pullString(formData.get("breed")),
      ageText: pullString(formData.get("age")) || pullString(formData.get("ageText")),
      gender: pullString(formData.get("gender")),
      vaccination: pullString(formData.get("vaccination")),
      size: pullString(formData.get("size")),

      // Pets: Wanted
      wantedPetType: pullString(formData.get("wantedPetType")),
      breedPreference: pullString(formData.get("breedPreference")),
      agePreference: pullString(formData.get("agePreference")),
      genderPreference: pullString(formData.get("genderPreference")),
      sizePreference: pullString(formData.get("sizePreference")),
      budget: pullNumber(formData.get("budget")),

      // Pets: Accessories
      accessoryName: pullString(formData.get("accessoryName")),

      // Pets: Lost & Found
      reportType: pullString(formData.get("reportType")),
      lastSeenLocation: pullString(formData.get("lastSeenLocation")),
      lfDate: pullString(formData.get("date")),

      // Pets: Services
      serviceType: pullString(formData.get("serviceType")),
      serviceProviderName: pullString(formData.get("serviceProviderName")),
      availability: pullString(formData.get("availability")),

      // Services
      educationType: pullString(formData.get("educationType")),
      subject: pullString(formData.get("subject")),
      mode: pullString(formData.get("mode")),
      qualification: pullString(formData.get("qualification")),
      cuisineType: pullString(formData.get("cuisineType")),
      dietaryOptions: pullArray(formData.get("dietaryOptions")),
      deliveryAvailable: pullString(formData.get("deliveryAvailable")),
      providerName: pullString(formData.get("providerName")),
      consultationMode: pullString(formData.get("consultationMode")),
      rateType: pullString(formData.get("rateType")),
      destination: pullString(formData.get("destination")),
      packageDetails: pullString(formData.get("packageDetails")),
      agencyName: pullString(formData.get("agencyName")),
      durationText:
        pullString(formData.get("duration")) ||
        pullString(formData.get("durationText")),
      level: pullString(formData.get("level")),
      urgency: pullString(formData.get("urgency")),
    };

    const errors: string[] = [];

    if (!postData.name) errors.push("Title is required");
    if (!postData.description) errors.push("Description is required");
    if (!postData.category) errors.push("Category is required");
    if (!postData.subcategory) errors.push("Subcategory is required");
    if (!postData.seller_info?.name) errors.push("Contact name is required");
    if (!postData.seller_info?.email) errors.push("Contact email is required");
    if (!postData.seller_info?.phone) errors.push("Contact phone is required");

    if (errors.length) {
      return { ok: false, error: errors.join(" • ") };
    }

    const countryCode = getCountryCode(formData, location);
    const adsId = await generateAdsId(countryCode);

    const newPost = new Post({
      ...postData,
      adsId,
    });

    await newPost.save();

    return { ok: true, id: String(newPost._id) };
  } catch (e: unknown) {
    console.error("addPost error:", e);

    if (e instanceof Error) {
      return { ok: false, error: e.message || "Server error" };
    }

    return { ok: false, error: "Server error" };
  }
}