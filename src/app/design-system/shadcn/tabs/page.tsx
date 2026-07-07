"use client";

import LaSection from "@/components/la/la-section";
import { LaTabs, LaTabsList, LaTabsTrigger, LaTokenRow } from "@/components/la";

export default function TabsPage() {
  return (
    <>
    
      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <LaSection title="Tabs">
        <LaTokenRow label="pill">
          <LaTabs defaultValue="a">
            <LaTabsList>
              <LaTabsTrigger value="a" variant="pill">All</LaTabsTrigger>
              <LaTabsTrigger value="b" variant="pill">Buying</LaTabsTrigger>
              <LaTabsTrigger value="c" variant="pill">Selling</LaTabsTrigger>
            </LaTabsList>
          </LaTabs>
        </LaTokenRow>
        <LaTokenRow label="underline">
          <LaTabs defaultValue="a">
            <LaTabsList>
              <LaTabsTrigger value="a" variant="underline">Overview</LaTabsTrigger>
              <LaTabsTrigger value="b" variant="underline">Activity</LaTabsTrigger>
              <LaTabsTrigger value="c" variant="underline">Settings</LaTabsTrigger>
            </LaTabsList>
          </LaTabs>
        </LaTokenRow>
        <LaTokenRow label="card">
          <LaTabs defaultValue="a">
            <LaTabsList className="bg-slate-100 rounded-lg p-1">
              <LaTabsTrigger value="a" variant="card">Month</LaTabsTrigger>
              <LaTabsTrigger value="b" variant="card">Quarter</LaTabsTrigger>
              <LaTabsTrigger value="c" variant="card">Year</LaTabsTrigger>
            </LaTabsList>
          </LaTabs>
        </LaTokenRow>
      </LaSection>

      
    </>
  );
}
