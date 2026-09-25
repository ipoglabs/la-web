"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function CreativeServicesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const name = store.name ?? "";
  const serviceType = (store as any).serviceType ?? "";
  const rateType = (store as any).rateType ?? "";
  const price = (store as any).price ?? "";
  const availability = (store as any).availability ?? "";
  const description = store.description ?? "";
  const skills = (store as any).skills ?? [];

  const sellerInfo = store.sellerInfo ?? {};
  const location = store.location ?? {};

  const [skillsText, setSkillsText] = useState(
    Array.isArray(skills) ? skills.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const commitSkills = () => {
    const arr = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("skills", arr);
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

    if (!name.trim()) mapped.name = "Title required";
    if (!serviceType) mapped.serviceType = "Service type required";
    if (!isPositive(price)) mapped.price = "Valid price required";
    if (!sellerInfo?.name?.trim()) mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone = "Phone required";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

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
      className="max-w-3xl mx-auto my-8 space-y-6"
    >
      <FormField label="Adv Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="graphic-design">Graphic Design</ToggleGroupButton>
        <ToggleGroupButton value="photography">Photography</ToggleGroupButton>
        <ToggleGroupButton value="videography">Videography</ToggleGroupButton>
        <ToggleGroupButton value="writing">Writing / Copywriting</ToggleGroupButton>
        <ToggleGroupButton value="music-audio">Music / Audio</ToggleGroupButton>
        <ToggleGroupButton value="web-design">Web / UI Design</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="space-y-1">
        <label className="text-sm font-medium">Skills / Tools</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. Photoshop, Premiere Pro, Copywriting"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
        />
        <p className="text-sm text-slate-500">Comma-separate skills — they will be saved as a list.</p>
      </div>

      <ToggleButtonGroup title="Rate Type" singleSelect value={rateType ? [rateType] : []} onChange={(v) => setField("rateType", v[0] ?? "")}>
        <ToggleGroupButton value="hourly">Hourly</ToggleGroupButton>
        <ToggleGroupButton value="per-project">Per Project</ToggleGroupButton>
        <ToggleGroupButton value="per-day">Per Day</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={`Price (${currency})`}
          field="price"
          type="number"
          value={price}
          onChange={(v) => setField("price", v)}
          required
        />
        <FormField
          label="Availability"
          field="availability"
          value={availability}
          onChange={(v) => setField("availability", v)}
        />
      </div>

      <input
        name="location"
        className="border rounded w-full px-3 py-2"
        placeholder="Location (if in-person)"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      <FormField
        label="Adv Details"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
       required />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
        />
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
        />
        <input
          name="sellerPhone"
          className="border rounded px-3 py-2"
          type="tel"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
        />
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
