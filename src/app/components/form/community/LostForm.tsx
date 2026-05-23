"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function LostAndFoundForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const reportType = (store as any).reportType ?? "";

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Community");
    if (!store.subcategory) setField("subcategory", "lostfound");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Lost & Found</h2>

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
            placeholder="Lost & Found"
            required
          />
        </div>

        <ToggleButtonGroup title="Report Type" singleSelect value={reportType ? [reportType] : []} onChange={(v) => setField("reportType", v[0] ?? "")}>
          <ToggleGroupButton value="lost">Lost</ToggleGroupButton>
          <ToggleGroupButton value="found">Found</ToggleGroupButton>
        </ToggleButtonGroup>

        {/* Item Title */}
        <FormField
          label="Item Name"
          field="name"
          placeholder="e.g., Wallet, Phone, Dog"
          required
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe the item (color, brand, unique features)"
          required
        />

        {/* Last Seen Location (matches config) */}
        <FormField
          label="Last Seen Location"
          field="lastSeenLocation"
          placeholder="Where was it lost or found?"
          required
        />

        {/* Date (matches config key lfDate) */}
        <FormField
          label="Date"
          field="lfDate"
          type="date"
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
              setSeller("name", (v as string) || "")
            }
            required
          />

          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", (v as string) || "")
            }
            required
          />

          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", (v as string) || "")
            }
          />
        </div> */}

        {/* Preview page handles submit */}
      </CardContent>
    </Card>
  );
}