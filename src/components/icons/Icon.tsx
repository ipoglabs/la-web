import * as React from "react";
import LaIcons from "./la-icons";

type IconComp = React.FC<{ className?: string }>;

function toKebab(s: string) {
  // Remove trailing "Icon" if present, then convert PascalCase to kebab-case
  const base = s.replace(/Icon$/, "");
  return base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const registry = Object.entries(LaIcons).reduce<Record<string, IconComp>>((acc, [exportName, comp]) => {
  if (typeof comp !== "function") return acc;
  const key = toKebab(exportName);
  acc[key] = comp as IconComp;
  return acc;
}, {});

export const ICON_KEYS = Object.keys(registry).sort();

export default function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Comp = registry[name];
  if (!Comp) return null;
  return <Comp className={className} />;
}

export { registry as ICON_REGISTRY };
