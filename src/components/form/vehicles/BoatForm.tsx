"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function BoatForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const make        = usePostFormStore((s) => (s as any).make) ?? "";
  const model       = usePostFormStore((s) => (s as any).model) ?? "";
  const year        = usePostFormStore((s) => (s as any).year) ?? "";
  const boatType    = usePostFormStore((s) => (s as any).boatType) ?? "";
  const lengthFt    = usePostFormStore((s) => (s as any).lengthFt) ?? "";
  const engineType  = usePostFormStore((s) => (s as any).engineType) ?? "";
  const condition   = usePostFormStore((s) => (s as any).condition) ?? "";
  const salePrice   = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const sellerInfo  = usePostFormStore((s) => s.sellerInfo) ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("boatform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())        mapped.name      = "Title is required.";
    if (!boatType)           mapped.boatType  = "Boat type is required.";
    if (!isPositive(salePrice)) mapped.salePrice = "Price must be greater than 0.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="boatForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post a Boat for Sale</h2>

      <FormField label="Adv Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Adv Details" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)}  required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Make" field="make" value={make} onChange={(v) => setField("make", v)} />
        <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} />
        <FormField label="Year" field="year" type="number" value={year} onChange={(v) => setField("year", v)} />
        <FormField label="Length (ft)" field="lengthFt" type="number" value={lengthFt} onChange={(v) => setField("lengthFt", v)} />
      </div>

      <ToggleButtonGroup title="Boat Type" singleSelect value={boatType ? [boatType] : []} onChange={(v) => setField("boatType", v[0] ?? "")}>
        <ToggleGroupButton value="motor">Motor Boat</ToggleGroupButton>
        <ToggleGroupButton value="sail">Sailboat</ToggleGroupButton>
        <ToggleGroupButton value="yacht">Yacht</ToggleGroupButton>
        <ToggleGroupButton value="fishing">Fishing Boat</ToggleGroupButton>
        <ToggleGroupButton value="jetski">Jet Ski</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Engine Type" singleSelect value={engineType ? [engineType] : []} onChange={(v) => setField("engineType", v[0] ?? "")}>
        <ToggleGroupButton value="inboard">Inboard</ToggleGroupButton>
        <ToggleGroupButton value="outboard">Outboard</ToggleGroupButton>
        <ToggleGroupButton value="none">None (Sail)</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="new">New</ToggleGroupButton>
        <ToggleGroupButton value="used">Used</ToggleGroupButton>
        <ToggleGroupButton value="refurbished">Refurbished</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label={`Price (${currency})`}
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => setField("salePrice", v)}
        required
      />

      <div className="space-y-2 border-t pt-6">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={sellerInfo?.name ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={sellerInfo?.email ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={sellerInfo?.phone ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
