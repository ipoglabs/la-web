"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateLocation } from "@/app/actions/profile/updateLocation";

import { COUNTRY_OPTIONS, STATE_MAP } from "@/lib/locationData";

import { Form } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";

import type { ProfileUser } from "../types";

type Props = {
  user: ProfileUser;
  onSuccess?: () => void;
};

export default function LocationEditForm({ user, onSuccess }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
   country: user.address?.country || "",
state: user.address?.state || "",
locality: user.address?.city || "",
postalCode: user.address?.postalCode || "",
  });

  const [loading, setLoading] = useState(false);

  const states = STATE_MAP[formData.country] || [];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateLocation({
        country: formData.country,
        state: formData.state,
        locality: formData.locality.trim(),
        postalCode: formData.postalCode.trim(),
      });

      toast.success("Location updated successfully");
      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-5">

      {/* COUNTRY */}
      <FormField label="Country / Region">
        <select
          value={formData.country}
          onChange={(e) =>
            setFormData({
              ...formData,
              country: e.target.value,
              state: "", // reset state when country changes
            })
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select country</option>
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </FormField>

      {/* STATE */}
      <FormField label="State">
        <select
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value })
          }
          disabled={!formData.country}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FormField>

      {/* POSTAL + CITY */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4">

        <FormField label="Postal Code">
          <Input
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
          />
        </FormField>

        <FormField label="City">
          <Input
            value={formData.locality}
            onChange={(e) =>
              setFormData({ ...formData, locality: e.target.value })
            }
          />
        </FormField>

      </FormFieldWrapper>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Form>
  );
}