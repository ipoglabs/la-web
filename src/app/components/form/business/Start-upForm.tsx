'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function StartupSupportForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Startup Support");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Startup Support Request</h2>

        <FormField label="Startup / Business Name" field="startupName" required />
        <FormField
          label="Founder Name"
          field="founderName"
          value={store.sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", v as string)}
          required
        />
        <FormField
          label="Email"
          field="__ignore_seller_email__"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
          required
        />
        <FormField
          label="Phone"
          field="__ignore_seller_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", v as string)}
          required
        />

        <SelectField
          label="Type of Support Needed"
          field="supportType"
          options={[
            { value: "funding", label: "Funding / Investment" },
            { value: "mentorship", label: "Mentorship" },
            { value: "incubation", label: "Incubation / Accelerator Program" },
            { value: "advisory", label: "Business Advisory" },
            { value: "networking", label: "Networking & Partnerships" },
          ]}
        />

        <SelectField
          label="Business Stage"
          field="businessStage"
          options={[
            { value: "idea", label: "Idea Stage" },
            { value: "early", label: "Early Stage" },
            { value: "growth", label: "Growth Stage" },
            { value: "scaling", label: "Scaling Stage" },
          ]}
        />

        <FormField label="Industry" field="industry" placeholder="E.g. Fintech, Healthtech, Edtech" />
        <FormField label="Business Description" field="description" type="textarea" required />
        <FormField label="Additional Notes" field="notes" type="textarea" />

      </CardContent>
    </Card>
  );
}
