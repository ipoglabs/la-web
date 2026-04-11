"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/actions/updateProfile";
import { toast } from "sonner";

export default function SecondaryForm({ user, field }: any) {
  const [value, setValue] = useState(user[field] || "");

  const save = async () => {
    await updateProfile({ [field]: value });
    toast.success("Updated");
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={save} className="w-full">Save</Button>
    </div>
  );
}