import { ShieldCheck, MapPin, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Trusted",
    desc: "Every listing is reviewed, connect with confidence.",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    icon: MapPin,
    title: "Local & Relevant",
    desc: "No clutter, just what's near you.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    desc: "discover in seconds. No hoops, no friction.",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Real people, real deals, right in your community.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
  },
];

function FeatureCard({
  item,
  className,
}: {
  item: (typeof features)[number];
  className?: string;
}) {
  const Icon = item.icon;
  return (
    <div className={cn("flex flex-col items-center text-center bg-white border border-stone-200 rounded-2xl shadow-sm", className)}>
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full mb-2",
          item.iconBg
        )}
      >
        <Icon className={cn("w-5 h-5", item.iconColor)} />
      </div>
      <h3 className="font-semibold text-slate-900 text-sm mb-1 leading-snug">
        {item.title}
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 md:line-clamp-none">{item.desc}</p>
    </div>
  );
}

export default function WhyLokalads() {
  return (
    <section className="py-6 pb-8">
      {/* Heading */}
      <h2 className="text-xl font-bold text-slate-900 text-center mb-3 px-4">
        Why use lokalads?
      </h2>

      {/* ── Mobile: 2×2 grid (hidden on md+) ── */}
      <div className="md:hidden max-w-sm mx-auto px-4">
        <div className="grid grid-cols-2 gap-3">
          {features.map((item) => (
            <FeatureCard
              key={item.title}
              item={item}
              className="px-3 py-4"
            />
          ))}
        </div>
      </div>

      {/* ── Tablet / Desktop: 4-column grid (hidden below md) ── */}
      <div className="hidden md:block max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          {features.map((item) => (
            <FeatureCard
              key={item.title}
              item={item}
              className="px-4 py-4"
            />
          ))}
        </div>
      </div>
    </section>
  );
}