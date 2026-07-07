"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { useCountryConfig } from "@/hooks/useCountryConfig";

export default function ClassesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const { currency } = useCountryConfig();
  const level = (store as any).level ?? "";
  const mode = (store as any).mode ?? "";

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Community");
    if (!store.subcategory) setField("subcategory", "classes");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post a Class</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            field="category"
            placeholder="Community"
            required
          />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Classes"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Class Title"
          field="name"
          placeholder="e.g., Guitar Lessons, Coding Bootcamp"
          required
        />

        {/* Subject */}
        <FormField
          label="Subject"
          field="subject"
          placeholder="e.g., Music, Programming, Yoga"
          required
        />

        <ToggleButtonGroup title="Level" singleSelect value={level ? [level] : []} onChange={(v) => setField("level", v[0] ?? "")}>
          <ToggleGroupButton value="beginner">Beginner</ToggleGroupButton>
          <ToggleGroupButton value="intermediate">Intermediate</ToggleGroupButton>
          <ToggleGroupButton value="advanced">Advanced</ToggleGroupButton>
          <ToggleGroupButton value="all">All Levels</ToggleGroupButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup title="Mode" singleSelect value={mode ? [mode] : []} onChange={(v) => setField("mode", v[0] ?? "")}>
          <ToggleGroupButton value="online">Online</ToggleGroupButton>
          <ToggleGroupButton value="offline">Offline</ToggleGroupButton>
          <ToggleGroupButton value="hybrid">Hybrid</ToggleGroupButton>
        </ToggleButtonGroup>

        {/* Fee */}
        <FormField
          label={`Fee (${currency})`}
          field="price"
          type="number"
          inputMode="decimal"
          placeholder="Enter class fee"
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the class"
          required
        />

        {/* Location (nested) */}
        {/* <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="Venue / City / Online link"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        /> */}

        {/* Instructor / Contact (sellerInfo) */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Instructor / Contact Details
          </h3>

          <FormField
            label="Instructor Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setSeller("name", (v as string) || "")
            }
            required
          />

          <FormField
            label="Instructor Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", (v as string) || "")
            }
          />

          <FormField
            label="Instructor Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", (v as string) || "")
            }
          />
        </div> */}

        {/* Preview handles submit */}
      </CardContent>
    </Card>
  );
}