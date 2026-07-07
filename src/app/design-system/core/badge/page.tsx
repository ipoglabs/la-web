"use client";

import LaSection from "@/components/la/la-section";
import { LaTokenRow, LaBadge, LaSeparator } from "@/components/la";

export default function BadgePage() {
  return (
    <>
    
    <LaSection title="Badge">
        <LaTokenRow label="soft">
          <LaBadge intent="neutral">Neutral</LaBadge>
          <LaBadge intent="info">Info</LaBadge>
          <LaBadge intent="success">Success</LaBadge>
          <LaBadge intent="warning">Warning</LaBadge>
          <LaBadge intent="danger">Danger</LaBadge>
          <LaBadge intent="brand">Brand</LaBadge>
          <LaBadge intent="purple">Purple</LaBadge>
        </LaTokenRow>
        <LaTokenRow label="solid">
          <LaBadge variant="solid" intent="neutral">Neutral</LaBadge>
          <LaBadge variant="solid" intent="info">Info</LaBadge>
          <LaBadge variant="solid" intent="success">Success</LaBadge>
          <LaBadge variant="solid" intent="danger">Danger</LaBadge>
        </LaTokenRow>
        <LaTokenRow label="outline">
          <LaBadge variant="outline" intent="neutral">Neutral</LaBadge>
          <LaBadge variant="outline" intent="info">Info</LaBadge>
          <LaBadge variant="outline" intent="success">Success</LaBadge>
        </LaTokenRow>
        <LaTokenRow label="with dot">
          <LaBadge intent="success" dot>Active</LaBadge>
          <LaBadge intent="warning" dot>Pending</LaBadge>
          <LaBadge intent="danger" dot>Suspended</LaBadge>
        </LaTokenRow>
        <LaTokenRow label="size sm">
          <LaBadge size="sm" intent="info">Small</LaBadge>
          <LaBadge size="sm" variant="solid" intent="success">Small</LaBadge>
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-300" />
    
    </>
  );
}
