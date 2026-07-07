// src/app/actions/updatePost.ts
"use server";

import { Types } from "mongoose";
import connectDB from "@/config/database";
import Post from "@/models/post";
import { getSession } from "@/lib/auth";
import { deleteImageVariants } from "@/lib/media/imageVariants";

/* ---------------------- helpers (unchanged from you) ---------------------- */

type LocationData = { address?: string; lat?: number; lng?: number };

function safeParse<T = any>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

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
  if (Array.isArray(parsed)) return parsed;
  return String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

function stripUndef(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) out[k] = v;
    else if (v && typeof v === "object" && !(v instanceof Date)) out[k] = stripUndef(v as any);
    else out[k] = v;
  }
  return out;
}

const normEmail = (e?: string) =>
  e ? String(e).trim().toLowerCase() : undefined;

/* ------------------------------------------------------------------------- */

export async function updatePost(
  postId: string,
  formData: FormData
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    if (!postId || !Types.ObjectId.isValid(postId)) {
      return { ok: false, error: "Invalid post id" };
    }

    await connectDB();

    // 🔐 Use same session mechanism as getCurrentUser()
    const session = await getSession();
    if (!session) {
      return { ok: false, error: "Not authenticated" };
    }

    const sessionUserId = session.userId;
    const sessionEmail = normEmail(session.email);

    if (!sessionUserId || !Types.ObjectId.isValid(sessionUserId)) {
      return { ok: false, error: "Invalid session user id" };
    }

    const sessionOwnerId = new Types.ObjectId(sessionUserId);

    // Load current doc first
    const current = await Post.findById(new Types.ObjectId(postId)).lean();
    if (!current) {
      return { ok: false, error: "Not found or not authorized to edit this post" };
    }

    // ----- Authorization -----
    const currentOwnerId = current.ownerId as Types.ObjectId | undefined;
    const currentEmail = normEmail(current.seller_info?.email);

    // You might have old posts without ownerId — allow by email match
    const hasOwnerMatch =
      currentOwnerId && String(currentOwnerId) === String(sessionOwnerId);

    const hasEmailMatch =
      sessionEmail && currentEmail && currentEmail === sessionEmail;

    if (!hasOwnerMatch && !hasEmailMatch) {
      return { ok: false, error: "Not found or not authorized to edit this post" };
    }

    // ----- Core fields -----
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

    // Seller info: accept anything from form, but fall back to current + session email
    const seller_info = {
      name:
        pullString(formData.get("seller_info.name")) ||
        pullString(formData.get("sellerInfo.name")) ||
        pullString(formData.get("contactName")),
      email:
        normEmail(
          pullString(formData.get("seller_info.email")) ||
            pullString(formData.get("sellerInfo.email")) ||
            pullString(formData.get("contactEmail")) ||
            pullString(formData.get("email"))
        ) ||
        sessionEmail ||
        undefined,
      phone:
        pullString(formData.get("seller_info.phone")) ||
        pullString(formData.get("sellerInfo.phone")) ||
        pullString(formData.get("contactPhone")) ||
        pullString(formData.get("contactNumber")),
    };

    // ----- Images: R2 URLs already uploaded client-side -----
    const base = process.env.R2_PUBLIC_URL || "";
    const imageUrlEntries = (formData.getAll("imageUrl") as string[]).filter(
      (v) => typeof v === "string" && v.startsWith("http") && (!base || v.startsWith(base))
    );

    const images =
      imageUrlEntries.length > 0 ? imageUrlEntries : ((current.images ?? []) as string[]);

    // Delete orphaned R2 variants when the user replaced or removed images
    if (imageUrlEntries.length > 0) {
      const previousImages = (current.images ?? []) as string[];
      const removedImages = previousImages.filter((url) => !imageUrlEntries.includes(url));
      if (removedImages.length > 0) {
        deleteImageVariants(removedImages).catch((e) =>
          console.error("R2 orphan cleanup error:", e)
        );
      }
    }

    // ----- Build update object (mostly your existing mapping) -----
    const updateRaw: Record<string, any> = {
      name,
      description,
      category,
      subcategory,
      location,
      images,

      status: "pending",

      seller_info: {
        name: seller_info.name ?? current.seller_info?.name,
        email: seller_info.email ?? current.seller_info?.email,
        phone: seller_info.phone ?? current.seller_info?.phone,
      },

      // Always ensure ownerId is set to session user for this edit
      ownerId: currentOwnerId ?? sessionOwnerId,

      // --- remaining fields (copied from your original) ---
      propertyType: pullString(formData.get("propertyType")),
      beds: pullNumber(formData.get("beds")),
      baths: pullNumber(formData.get("baths")),
      rentPrice: pullNumber(formData.get("rentPrice")),
      salePrice: pullNumber(formData.get("salePrice")),
      deposit: pullNumber(formData.get("deposit")),
      facilities: pullArray(formData.get("facilities")),
      amenities: pullArray(formData.get("amenities")),
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
      holidayType: pullString(formData.get("holidayType")),
      guests: pullNumber(formData.get("guests")),
      house_rules: pullArray(formData.get("house_rules")),
      rateNightly: pullNumber(formData.get("rateNightly")),
      rateWeekly: pullNumber(formData.get("rateWeekly")),
      rateMonthly: pullNumber(formData.get("rateMonthly")),
      type: pullString(formData.get("type")),
      rent: pullNumber(formData.get("rent")),
      preferred_tenants: pullString(formData.get("preferred_tenants")),
      rules: pullArray(formData.get("rules")),
      plot_area: pullNumber(formData.get("plot_area")),
      negotiable: pullString(formData.get("negotiable")),
      ownership: pullString(formData.get("ownership")),
      age: pullString(formData.get("age")),
      minBudget: pullNumber(formData.get("minBudget")),
      maxBudget: pullNumber(formData.get("maxBudget")),
      minArea: pullNumber(formData.get("minArea")),
      preferred_locations: pullArray(formData.get("preferred_locations")),

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

      petName: pullString(formData.get("petName")),
      petType: pullString(formData.get("petType")),
      breed: pullString(formData.get("breed")),
      ageText:
        pullString(formData.get("age")) ||
        pullString(formData.get("ageText")),
      gender: pullString(formData.get("gender")),
      vaccination: pullString(formData.get("vaccination")),
      size: pullString(formData.get("size")),
      wantedPetType: pullString(formData.get("wantedPetType")),
      breedPreference: pullString(formData.get("breedPreference")),
      agePreference: pullString(formData.get("agePreference")),
      genderPreference: pullString(formData.get("genderPreference")),
      sizePreference: pullString(formData.get("sizePreference")),
      budget: pullNumber(formData.get("budget")),
      accessoryName: pullString(formData.get("accessoryName")),
      partsCategory: pullString(formData.get("partsCategory")),
      reportType: pullString(formData.get("reportType")),
      lastSeenLocation: pullString(formData.get("lastSeenLocation")),
      lfDate: pullString(formData.get("date")),
      serviceType: pullString(formData.get("serviceType")),
      serviceProviderName: pullString(formData.get("serviceProviderName")),
      availability: pullString(formData.get("availability")),

      educationType: pullString(formData.get("educationType")),
      subject: pullString(formData.get("subject")),
      mode: pullString(formData.get("mode")),
      qualification: pullString(formData.get("qualification")),
      price: pullNumber(formData.get("price")),
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

    // Map service price → salePrice if given that way
    if (updateRaw.salePrice === undefined) {
      const svcPrice = pullNumber(formData.get("price"));
      if (svcPrice !== undefined) updateRaw.salePrice = svcPrice;
    }

    // ----- Required checks based on effective values -----
    const effective = {
      name: updateRaw.name ?? current.name,
      description: updateRaw.description ?? current.description,
      category: updateRaw.category ?? current.category,
      subcategory: updateRaw.subcategory ?? current.subcategory,
      seller_info: {
        name: updateRaw.seller_info?.name ?? current.seller_info?.name,
        email: updateRaw.seller_info?.email ?? current.seller_info?.email,
        phone: updateRaw.seller_info?.phone ?? current.seller_info?.phone,
      },
    };

    const errors: string[] = [];
    if (!effective.name) errors.push("Title is required");
    if (!effective.description) errors.push("Description is required");
    if (!effective.category) errors.push("Category is required");
    if (!effective.subcategory) errors.push("Subcategory is required");
    if (!effective.seller_info?.name) errors.push("Contact name is required");
    if (!effective.seller_info?.email) errors.push("Contact email is required");
    if (!effective.seller_info?.phone) errors.push("Contact phone is required");

    if (errors.length) {
      return { ok: false, error: errors.join(" • ") };
    }

    // ----- Clean $set and final safety -----
    const $set = stripUndef(updateRaw);

    // Final safety: ensure ownerId is a valid ObjectId
    if ("ownerId" in $set && !($set.ownerId instanceof Types.ObjectId)) {
      $set.ownerId = sessionOwnerId;
    }

    const doc = await Post.findOneAndUpdate(
      { _id: new Types.ObjectId(postId) },
      { $set },
      { new: true, runValidators: true }
    ).lean();

    if (!doc) {
      return { ok: false, error: "Not found or not authorized to edit this post" };
    }

    return { ok: true, id: String(doc._id) };
  } catch (e: any) {
    console.error("updatePost fatal error:", e);
    return { ok: false, error: e?.message || "Unknown server error in updatePost" };
  }
}
