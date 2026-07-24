"use client";
import LaSection from "@/components/la/la-section";
import { LaText } from "@/components/la/la-text";
import { Avatar } from "@/components/avatar/Avatar";
import { AvatarDropdown } from "@/components/avatar/AvatarDropdown";

/* ── shared section wrapper ─────────────────────────────────── */
function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>}
      <div className="flex flex-wrap items-end gap-4">{children}</div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {children}
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

import * as React from "react";

export default function AvatarDemoPage() {
  return (
    <>
      {/* ── Sizes ─────────────────────────────────── */}
      <LaSection title="Avatar">
        <LaText type="small" as="p" className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Sizes
        </LaText>
        <Row>
          <Cell label="xs"><Avatar initials="KG" size="xs" /></Cell>
          <Cell label="sm"><Avatar initials="KG" size="sm" /></Cell>
          <Cell label="md"><Avatar initials="KG" size="md" /></Cell>
          <Cell label="lg"><Avatar initials="KG" size="lg" /></Cell>
          <Cell label="xl"><Avatar initials="KG" size="xl" /></Cell>
          <Cell label="2xl"><Avatar initials="KG" size="2xl" /></Cell>
        </Row>

        {/* ── Status dots ───────────────────────────── */}
        <LaText type="small" as="p" className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">
          Status Indicators
        </LaText>
        <Row>
          <Cell label="online"><Avatar  initials="KG" size="md" status="online"  /></Cell>
          <Cell label="busy"><Avatar    initials="KG" size="md" status="busy"    /></Cell>
          <Cell label="offline"><Avatar initials="KG" size="md" status="offline" /></Cell>
          <Cell label="none"><Avatar    initials="KG" size="md" status="none"    /></Cell>
        </Row>

        {/* ── Image vs initials ─────────────────────── */}
        <LaText type="small" as="p" className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">
          Image vs Initials Fallback
        </LaText>
        <Row>
          <Cell label="image"><Avatar src="/img/img1.jpg" alt="User 1" initials="U1" size="lg" status="online" /></Cell>
          <Cell label="image"><Avatar src="/img/img2.jpg" alt="User 2" initials="U2" size="lg" status="busy"   /></Cell>
          <Cell label="image"><Avatar src="/img/img3.jpg" alt="User 3" initials="U3" size="lg" /></Cell>
          <Cell label="broken → fallback"><Avatar src="/img/broken.jpg" initials="FB" size="lg" /></Cell>
          <Cell label="no src"><Avatar initials="KG" size="lg" status="online" /></Cell>
        </Row>

        {/* ── Shapes ───────────────────────────────── */}
        <LaText type="small" as="p" className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">
          Shapes
        </LaText>
        <Row>
          <Cell label="circle (default)"><Avatar src="/img/img4.jpg" initials="C" size="lg" shape="circle" /></Cell>
          <Cell label="rounded"><Avatar         src="/img/img5.jpg" initials="R" size="lg" shape="rounded" /></Cell>
          <Cell label="circle initials"><Avatar initials="KG" size="lg" shape="circle"  status="online" /></Cell>
          <Cell label="rounded initials"><Avatar initials="KG" size="lg" shape="rounded" status="busy"   /></Cell>
        </Row>

        {/* ── Ring ─────────────────────────────────── */}
        <LaText type="small" as="p" className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">
          Ring (grey ring + white gap — hero/profile-header use)
        </LaText>
        <Row>
          <Cell label="ring"><Avatar src="/img/img4.jpg" initials="R" size="xl" ring /></Cell>
          <Cell label="ring + status"><Avatar initials="KG" size="xl" ring status="online" /></Cell>
          <Cell label="ring, 2xl"><Avatar src="/img/img5.jpg" initials="R" size="2xl" ring status="online" /></Cell>
        </Row>
      </LaSection>

      {/* ── Profile Menu ─────────────────────────── */}
      <LaSection title="Profile Menu">
        <LaText type="small" as="p" className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          AvatarDropdown
        </LaText>
        <p className="text-xs text-slate-500">
          Desktop: click avatar to open a floating popover. Mobile: opens a bottom drawer.
          Menu items: My Ads · Chat · Profile · Switch Country · Sign out.
        </p>

        <div className="flex flex-wrap items-start gap-6 mt-2">
          {/* Initials only */}
          <div className="flex flex-col items-center gap-2">
            <AvatarDropdown name="Karthik G" subtitle="Member" initials="KG" />
            <span className="text-xs text-slate-400">Initials</span>
          </div>

          {/* With image */}
          <div className="flex flex-col items-center gap-2">
            <AvatarDropdown name="Jane Smith" subtitle="Premium · Singapore" initials="JS" src="/img/img1.jpg" />
            <span className="text-xs text-slate-400">With image</span>
          </div>

          {/* Long name */}
          <div className="flex flex-col items-center gap-2">
            <AvatarDropdown name="Aleksandar Novakovic" subtitle="Business Account" initials="AN" />
            <span className="text-xs text-slate-400">Long name</span>
          </div>
        </div>
      </LaSection>
    </>
  );
}

