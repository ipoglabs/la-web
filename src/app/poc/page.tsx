import Link from "next/link";
import { CountryBadge } from "@/components/country/CountryBadge";


function NavCard({
  href,
  label,
  description,
  tag,
}: {
  href: string;
  label: string;
  description: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 hover:bg-accent/50 transition-colors group"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {tag && (
            <span className="text-xs font-mono text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
              {tag}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <span className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors text-sm">
        →
      </span>
    </Link>
  );
}

export default function PocIndexPage() {
  return (
    <div className="flex flex-1 items-start justify-center">
      <div className="w-full max-w-lg px-6 py-20">

        <div className="mb-14 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">poc-next</h1>
            <p className="text-sm text-muted-foreground mt-1">
              UI/UX playground — components and experiments
            </p>
          </div>
          <CountryBadge />
        </div>

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Design System</p>
          <div className="space-y-2">
            <NavCard
              href="/design-system"
              label="la · Design System"
              description="Living reference — Button, Input, Field, Badge, Avatar, Card, Separator, Tabs"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
