"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateProfile } from "@/app/actions/updateProfile";

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
    nationality: user.nationality || "",
    postalCode: user.address?.postalCode || "",
    locality: user.locality || "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfile({
        nationality: formData.nationality.trim(),
        locality: formData.locality.trim(),
        address: {
          postalCode: formData.postalCode.trim(),
        },
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
      <FormField label="Country / Region" htmlFor="nationality">
        <Input
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={(e) =>
            setFormData({ ...formData, nationality: e.target.value })
          }
          placeholder="Enter country"
        />
      </FormField>

      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <FormField label="Postal Code" htmlFor="postalCode" className="mb-0">
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
            placeholder="Enter postal code"
          />
        </FormField>

        <FormField label="City" htmlFor="locality" className="mb-0">
          <Input
            id="locality"
            name="locality"
            value={formData.locality}
            onChange={(e) =>
              setFormData({ ...formData, locality: e.target.value })
            }
            placeholder="Enter city"
          />
        </FormField>
      </FormFieldWrapper>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Form>
  );
}