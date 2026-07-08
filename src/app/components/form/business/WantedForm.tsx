"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { useCountryConfig } from "@/hooks/useCountryConfig";

export default function WantedForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const { currency } = useCountryConfig();
  const urgency = (store as any).urgency ?? "";

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "wanted");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  const setLocationAddress = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post a Wanted Listing</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            field="category"
            placeholder="Business"
            required
          />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Wanted"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Wanted Title"
          field="name"
          placeholder="e.g., Looking for Manufacturing Partner"
          required
        />

        {/* Budget */}
        <FormField
          label={`Budget (${currency})`}
          field="budgetAmount"
          type="number"
          inputMode="decimal"
          placeholder="Enter your budget"
        />

        <ToggleButtonGroup title="Urgency" singleSelect value={urgency ? [urgency] : []} onChange={(v) => setField("urgency", v[0] ?? "")}>
          <ToggleGroupButton value="immediate">Immediate</ToggleGroupButton>
          <ToggleGroupButton value="within-month">Within a Month</ToggleGroupButton>
          <ToggleGroupButton value="flexible">Flexible</ToggleGroupButton>
        </ToggleButtonGroup>

        {/* Location (nested) */}
        <FormField
          label="Preferred Location"
          field="__ignore_location__"
          placeholder="Enter preferred city / region"
          value={store.location?.address ?? ""}
          onChange={(v) =>
            setLocationAddress((v as string) || "")
          }
          required
        />

        {/* Description */}
        <FormField
          label="Wanted Details"
          field="description"
          type="textarea"
          placeholder="Describe what you are looking for..."
          required
        />

        {/* Contact Section */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Contact Information
          </h3>

          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setSeller("name", v as string)
            }
            required
          />

          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", v as string)
            }
            required
          />

          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", v as string)
            }
          />
        </div> */}
      </CardContent>
    </Card>
  );
}