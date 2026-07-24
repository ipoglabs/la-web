"use client";

import { useState } from "react";
import LaSection from "@/components/la/la-section";
import { LaTokenRow, LaSwitch, LaSeparator } from "@/components/la";

export default function SwitchPage() {
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);

  return (
    <>
      <LaSection title="Switch">
        <LaTokenRow label="default">
          <LaSwitch checked={on} onCheckedChange={setOn} />
          <LaSwitch checked={off} onCheckedChange={setOff} />
          <LaSwitch checked disabled />
          <LaSwitch checked={false} disabled />
        </LaTokenRow>
        <LaTokenRow label="sm">
          <LaSwitch size="sm" checked={on} onCheckedChange={setOn} />
          <LaSwitch size="sm" checked={off} onCheckedChange={setOff} />
        </LaTokenRow>
        <LaTokenRow label="with label + description (settings row)">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4">
            <LaSwitch
              label="Email notifications"
              description="Get updates about your listings and messages"
              checked={on}
              onCheckedChange={setOn}
            />
          </div>
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-300" />
    </>
  );
}
