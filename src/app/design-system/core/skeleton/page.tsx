"use client";

import LaSection from "@/components/la/la-section";
import { LaTokenRow, LaSkeleton, LaSeparator } from "@/components/la";

export default function SkeletonPage() {
  return (
    <>
      <LaSection title="Skeleton">
        <LaTokenRow label="text">
          <div className="w-64 space-y-2">
            <LaSkeleton shape="text" className="w-2/5" />
            <LaSkeleton shape="text" className="w-5/6" />
            <LaSkeleton shape="text" className="w-3/4" />
          </div>
        </LaTokenRow>

        <LaTokenRow label="block">
          <LaSkeleton shape="block" className="h-24 w-40" />
        </LaTokenRow>

        <LaTokenRow label="circle">
          <LaSkeleton shape="circle" className="size-12" />
        </LaTokenRow>

        <LaTokenRow label="composed — card">
          <div className="w-48 overflow-hidden rounded-lg bg-white">
            <LaSkeleton shape="block" className="aspect-4/3 rounded-none" />
            <div className="space-y-2 p-2">
              <LaSkeleton shape="text" className="w-2/5" />
              <LaSkeleton shape="text" className="w-5/6" />
              <LaSkeleton shape="text" className="w-1/2" />
            </div>
          </div>
        </LaTokenRow>

        <LaTokenRow label="composed — list row">
          <div className="flex w-72 items-center gap-3">
            <LaSkeleton shape="circle" className="size-10 shrink-0" />
            <div className="flex-1 space-y-2">
              <LaSkeleton shape="text" className="w-1/2" />
              <LaSkeleton shape="text" className="w-3/4" />
            </div>
          </div>
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-300" />
    </>
  );
}
