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

    // --- Core fields (with fallbacks some older forms used) ---
    const name =
      ((formData.get("name") as string) ?? "").trim() ||
      ((formData.get("jobTitle") as string) ?? "").trim() ||
      ((formData.get("projectTitle") as string) ?? "").trim();

    const description = ((formData.get("description") as string) ?? "").trim();
    const category = ((formData.get("category") as string) ?? "").trim();
    const subcategory = ((formData.get("subcategory") as string) ?? "").trim();

    // locationData is a JSON string from client; may be empty for some services
    const locationRaw = (formData.get("locationData") as string) || "";
    const location: LocationData = locationRaw
      ? safeParse<LocationData>(locationRaw, {})
      : {};

    // Helpers
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

    // Seller info (accept both snake/camel + legacy contact* fields)
    const seller_info = {
      name:
        pullString(formData.get("seller_info.name")) ||
        pullString(formData.get("sellerInfo.name")) ||
        pullString(formData.get("contactName")) ||
        "",
      email:
        pullString(formData.get("seller_info.email")) ||
        pullString(formData.get("sellerInfo.email")) ||
        pullString(formData.get("contactEmail")) ||
        pullString(formData.get("email")) || // some older forms used `email`
        "",
      phone:
        pullString(formData.get("seller_info.phone")) ||
        pullString(formData.get("sellerInfo.phone")) ||
        pullString(formData.get("contactPhone")) ||
        pullString(formData.get("contactNumber")) || // legacy
        "",
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

    // Reusable arrays
    const facilities = pullArray(formData.get("facilities"));
    const amenities = pullArray(formData.get("amenities"));

    // ===== Build postData (property + jobs + vehicles + parts + pets + services) =====
    const postData: Record<string, any> = {
      // core
      category,
      subcategory,
      name,
      description,
      location,
      seller_info,
      images,

      // ===== Property =====
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

      // sale extras
      plot_area: pullNumber(formData.get("plot_area")),
      negotiable: pullString(formData.get("negotiable")),
      ownership: pullString(formData.get("ownership")),
      age: pullString(formData.get("age")),

      // ===== Jobs =====
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

      // ===== Vehicles =====
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

      // ===== Parts (Vehicles) =====
      partsCategory: pullString(formData.get("partsCategory")),
      brand: pullString(formData.get("brand")),
      compatibility: pullArray(formData.get("compatibility")),

      // ===== Pets: Adoption =====
      petName: pullString(formData.get("petName")),
      petType: pullString(formData.get("petType")),
      breed: pullString(formData.get("breed")),
      ageText: pullString(formData.get("age")) || pullString(formData.get("ageText")),
      gender: pullString(formData.get("gender")),
      vaccination: pullString(formData.get("vaccination")),
      size: pullString(formData.get("size")),

      // ===== Pets: Wanted =====
      wantedPetType: pullString(formData.get("wantedPetType")),
      breedPreference: pullString(formData.get("breedPreference")),
      agePreference: pullString(formData.get("agePreference")),
      genderPreference: pullString(formData.get("genderPreference")),
      sizePreference: pullString(formData.get("sizePreference")),
      budget: pullNumber(formData.get("budget")),

      // ===== Pets: Accessories =====
      accessoryName: pullString(formData.get("accessoryName")),
      // partsCategory/brand/condition/salePrice/description reused

      // ===== Pets: Lost & Found =====
      reportType: pullString(formData.get("reportType")),
      lastSeenLocation: pullString(formData.get("lastSeenLocation")),
      lfDate: pullString(formData.get("date")), // normalize to string

      // ===== Pets: Services =====
      serviceType: pullString(formData.get("serviceType")),
      serviceProviderName: pullString(formData.get("serviceProviderName")),
      availability: pullString(formData.get("availability")),

      // ===== Services (new categories) =====
      // Education
      educationType: pullString(formData.get("educationType")),
      subject: pullString(formData.get("subject")),
      mode: pullString(formData.get("mode")),
      qualification: pullString(formData.get("qualification")),
      // Food
      cuisineType: pullString(formData.get("cuisineType")),
      dietaryOptions: pullArray(formData.get("dietaryOptions")),
      deliveryAvailable: pullString(formData.get("deliveryAvailable")),
      // Health
      providerName: pullString(formData.get("providerName")),
      consultationMode: pullString(formData.get("consultationMode")),
      // Technology
      rateType: pullString(formData.get("rateType")),
      // Travel
      destination: pullString(formData.get("destination")),
      packageDetails: pullString(formData.get("packageDetails")),
      agencyName: pullString(formData.get("agencyName")),
      durationText: pullString(formData.get("duration")) || pullString(formData.get("durationText")),
      // Tutoring
      level: pullString(formData.get("level")),
      // Service Wanted
      urgency: pullString(formData.get("urgency")),
    };

    // If a services form used "price" instead of salePrice, map it in
    if (postData.salePrice === undefined) {
      const svcPrice = pullNumber(formData.get("price"));
      if (svcPrice !== undefined) postData.salePrice = svcPrice;
    }

    // --- Required checks (relaxed: location.address is optional now) ---
    const errors: string[] = [];
    if (!postData.name) errors.push("Title is required");
    if (!postData.description) errors.push("Description is required");
    if (!postData.category) errors.push("Category is required");
    if (!postData.subcategory) errors.push("Subcategory is required");
    if (!postData.seller_info?.name) errors.push("Contact name is required");
    if (!postData.seller_info?.email) errors.push("Contact email is required");
    if (!postData.seller_info?.phone) errors.push("Contact phone is required");

    if (errors.length) {
      console.error("Validation errors:", errors, { postData });
      return { ok: false, error: errors.join(" • ") };
    }

    const newPost = new Post(postData);
    await newPost.save();

    return { ok: true, id: String(newPost._id) };
  } catch (e: any) {
    console.error("addPost fatal error:", e);
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
