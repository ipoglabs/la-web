"use client";

import { Search, Plus, Heart, ArrowRight, Bell } from "lucide-react";
import LaSection from "@/components/la/la-section";
import { LaText, LaButton, LaSeparator } from "@/components/la";

export default function ButtonPage() {
  return (
    <>

    {/* ───── Primary Button ───── */}
    <LaSection title="Primary Button">
        {/* Primary — card per color, states stack inside */}
        <LaText
        type="small"
        as="p"
        className="text-sm font-semibold uppercase tracking-widest text-slate-400"
        >
        Compact Variant
        </LaText>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
            { intent: "primary", label: "Dark" },
            { intent: "primary-blue", label: "Blue" },
            { intent: "primary-rose", label: "Rose" },
            { intent: "primary-amber", label: "Amber" },
        ] as const).map(({ intent, label }) => (
            <div key={intent} className="space-y-2">
            <LaText
                type="small"
                as="p"
                className="text-sm font-semibold text-slate-500"
            >
                {label}
            </LaText>

            <div className="space-y-1.5">
                <div>
                <LaText
                    type="small"
                    as="p"
                    className="text-xs text-slate-400 mb-0.5"
                >
                    Normal
                </LaText>
                <LaButton intent={intent} size="compact">
                    Button
                </LaButton>
                </div>

                <div>
                <LaText
                    type="small"
                    as="p"
                    className="text-xs text-slate-400 mb-0.5"
                >
                    Disabled
                </LaText>
                <LaButton intent={intent} size="compact" disabled>
                    Button
                </LaButton>
                </div>

                <div>
                <LaText
                    type="small"
                    as="p"
                    className="text-xs text-slate-400 mb-0.5"
                >
                    Loading
                </LaText>
                <LaButton intent={intent} size="compact" loading>
                    Button
                </LaButton>
                </div>
            </div>
            </div>
        ))}
        </div>

        <LaSeparator className="bg-slate-100" />

        {/* Variants — card per variant */}
        <LaText
        type="small"
        as="p"
        className="text-sm font-semibold uppercase tracking-widest text-slate-400"
        >
        Default Variants
        </LaText>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {([
            { intent: "primary", label: "Dark" },
            { intent: "primary-blue", label: "Blue" },
            { intent: "primary-rose", label: "Rose" },
            { intent: "primary-amber", label: "Amber" },
            { intent: "danger", label: "Danger" },
        ] as const).map(({ intent, label }) => (
            <div key={intent} className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <div className="space-y-1.5">
                <div>
                <p className="text-sm text-slate-400 mb-0.5">Normal</p>
                <LaButton intent={intent} size="default">
                    Button
                </LaButton>
                </div>
                <div>
                <p className="text-sm text-slate-400 mb-0.5">Disabled</p>
                <LaButton intent={intent} size="default" disabled>
                    Button
                </LaButton>
                </div>
            </div>
            </div>
        ))}
        </div>
    </LaSection>

    {/* ───── Secondary Button ───── */}
    <LaSection title="Secondary Button">

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {([
            { intent: "secondary", label: "Secondary" },
            { intent: "outline", label: "Outline" },
            { intent: "ghost", label: "Ghost" },
            { intent: "link", label: "Link" },
        ] as const).map(({ intent, label }) => (
            <div key={intent} className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <div className="space-y-1.5">
                <div>
                <p className="text-sm text-slate-400 mb-0.5">Normal</p>
                <LaButton intent={intent} size="default">
                    Button
                </LaButton>
                </div>
                <div>
                <p className="text-sm text-slate-400 mb-0.5">Disabled</p>
                <LaButton intent={intent} size="default" disabled>
                    Button
                </LaButton>
                </div>
            </div>
            </div>
        ))}
        </div>
    </LaSection>

    {/* ───── Button Sizes ───── */}
    <LaSection title="Button Sizes">

        <div className="space-y-3">
        {([
            { intent: "primary", label: "Dark" },
            { intent: "primary-rose", label: "Rose" },
        ] as const).map(({ intent, label }) => (
            <div key={intent} className="flex flex-wrap items-end gap-2">
            <LaText type="label" as="span" className="w-10 shrink-0 text-sm text-slate-400">
                {label}
            </LaText>
            <LaButton intent={intent} size="mini">
                Mini
            </LaButton>
            <LaButton intent={intent} size="compact">
                Compact
            </LaButton>
            <LaButton intent={intent} size="default">
                Default
            </LaButton>
            <LaButton intent={intent} size="big">
                Big
            </LaButton>
            <LaButton intent={intent} size="bigger">
                Bigger
            </LaButton>
            <LaButton intent={intent} size="biggest">
                Biggest
            </LaButton>
            </div>
        ))}
        </div>
    </LaSection>

    {/* ───── Icons ───── */}
    <LaSection title="Icon Buttons">
        <LaText
        type="small"
        as="p"
        className="text-sm font-semibold uppercase tracking-widest text-slate-400"
        >
        Icon only
        </LaText>

        <div className="flex flex-wrap items-end gap-2">
        <LaButton size="mini" iconOnly>
            <Plus />
        </LaButton>
        <LaButton size="compact" iconOnly>
            <Plus />
        </LaButton>
        <LaButton size="default" iconOnly>
            <Plus />
        </LaButton>
        <LaButton size="big" iconOnly>
            <Plus />
        </LaButton>
        <LaButton size="bigger" iconOnly>
            <Plus />
        </LaButton>
        <LaButton size="biggest" iconOnly>
            <Plus />
        </LaButton>
        <LaSeparator orientation="vertical" className="h-10" />
        <LaButton size="big" iconOnly intent="primary-blue">
            <Search />
        </LaButton>
        <LaButton size="big" iconOnly intent="primary-rose">
            <Heart />
        </LaButton>
        <LaButton size="big" iconOnly intent="secondary">
            <Bell />
        </LaButton>
        <LaButton size="big" iconOnly intent="outline">
            <ArrowRight />
        </LaButton>
        <LaButton size="big" iconOnly intent="ghost">
            <Plus />
        </LaButton>
        </div>
    </LaSection>
    
    </>
  );
}
