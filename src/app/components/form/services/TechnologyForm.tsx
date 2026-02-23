"use client";

import React, { useMemo, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function TechnologyServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Controlled values from store
  const name = store.name ?? "";
  const description = store.description ?? "";

  const serviceType = (store as any).serviceType ?? "";
  const rateType = (store as any).rateType ?? ""; // as per config: rateType
  const price = (store as any).price ?? "";
  const availability = (store as any).availability ?? "";

  const sellerInfo = store.sellerInfo ?? {};
  const location = store.location ?? {};

  const skillsArr = useMemo(() => {
    const v = (store as any).skills;
    return Array.isArray(v) ? v : typeof v === "string" && v.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [store]);

  const [skillsText, setSkillsText] = useState(
    Array.isArray(skillsArr) ? skillsArr.join(", ") : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el =
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`) ??
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  // comma-list -> array in store
  const commitSkills = () => {
    const arr = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("skills", arr);
  };

  // price should also mirror to salePrice (so preview/backend stays consistent)
  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLoc = (address?: string) => {
    const cur = location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Title is required";
    if (!description.trim()) mapped.description = "Description is required";
    if (!serviceType) mapped.serviceType = "Service Type is required";

    // skills optional in your config? (it is present; if you want required, enforce below)
    // if (!skillsText.trim()) mapped.skills = "Skills is required";

    if (!rateType) mapped.rateType = "Rate Type is required";
    if (!isPositive(price)) mapped.price = "Valid price required";
    if (!availability) mapped.availability = "Availability is required";

    // location optional? if you want required, enable below
    // if (!location?.address?.trim()) mapped.location = "Location is required";

    // seller required (your global flow expects these)
    if (!sellerInfo?.name?.trim()) mapped.sellerName = "Contact name required";
    if (!sellerInfo?.email?.trim()) mapped.sellerEmail = "Email required";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone = "Phone required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // persist trimmed / cleaned values
    setField("name", name.trim());
    setField("description", description.trim());
    commitSkills();

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">Technology Service</h2>

      {/* Service Type */}
      <SelectField
        label="Service Type"
        field="serviceType"
        value={serviceType}
        onChange={(v) => setField("serviceType", v)}
        options={[
          { value: "it-support", label: "IT Support" },
          { value: "software-development", label: "Software Development" },
          { value: "web-design", label: "Web Design & Development" },
          { value: "networking", label: "Networking & Security" },
          { value: "repair", label: "Hardware/Device Repair" },
          { value: "consulting", label: "Tech Consulting" },
          { value: "other", label: "Other" },
        ]}
      />

      {/* Title */}
      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        placeholder="e.g., Professional Web Developer"
        required
      />

      {/* Description */}
      <FormField
        label="Service Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        placeholder="Describe your service in detail..."
        required
      />

      {/* Skills (comma -> array) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Skills / Expertise</label>
        <input
          name="skills"
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. JavaScript, React, Networking, AWS"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
        />
        <p className="text-xs text-gray-500">
          Tip: comma-separate skills; we’ll save them as a list.
        </p>
      </div>

      {/* Availability */}
      <SelectField
        label="Availability"
        field="availability"
        value={availability}
        onChange={(v) => setField("availability", v)}
        options={[
          { value: "full-time", label: "Full-Time" },
          { value: "part-time", label: "Part-Time" },
          { value: "contract", label: "Contract" },
          { value: "freelance", label: "Freelance" },
          { value: "remote", label: "Remote" },
        ]}
      />

      {/* Location */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Location</label>
        <input
          name="location"
          className="border rounded w-full py-2 px-3"
          placeholder="City / Online"
          value={location?.address ?? ""}
          onChange={(e) => setLoc(e.target.value)}
        />
      </div>

      {/* Rate Type + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Rate Type"
          field="rateType"
          value={rateType}
          onChange={(v) => setField("rateType", v)}
          options={[
            { value: "hourly", label: "Hourly" },
            { value: "daily", label: "Daily" },
            { value: "monthly", label: "Monthly" },
            { value: "project", label: "Per Project" },
            { value: "negotiable", label: "Negotiable" },
          ]}
        />
        <FormField
          label="Price (₹)"
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          placeholder="Enter amount"
          required
        />
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
          required
        />
        <input
          name="sellerPhone"
          className="border rounded px-3 py-2"
          type="tel"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
      </div>

      {/* Hidden submit button for global Next */}
      <button type="submit" className="sr-only" />
    </form>
  );
}