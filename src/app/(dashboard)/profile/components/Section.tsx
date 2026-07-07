"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type SectionProps = {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  hideEdit?: boolean;
  editLabel?: string;
};

export default function Section({
  title,
  children,
  onEdit,
  hideEdit = false,
  editLabel = "Edit",
}: SectionProps) {
  return (
    <section className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">{title}</h2>

        {!hideEdit && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            {editLabel}
          </Button>
        )}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}