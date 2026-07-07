"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EventMeta = Partial<{
  event_id: string;
  timestamp: string;
  path: string;
  client_ip: string;
  user_agent: string;
  user_id: string | null;
}>;

function SupportButton({ eventMeta }: { eventMeta?: EventMeta }) {
  const handleContact = () => {
    const payload = {
      event_id: eventMeta?.event_id,
      timestamp: eventMeta?.timestamp,
      path: eventMeta?.path,
      client_ip: eventMeta?.client_ip,
      user_agent: eventMeta?.user_agent,
      user_id: eventMeta?.user_id ?? "anonymous",
    };

    const url = `/support/new?payload=${encodeURIComponent(JSON.stringify(payload))}`;
    // open in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button variant="outline" onClick={handleContact} aria-label="Contact support">
      Contact support
    </Button>
  );
}

export function SecurityBlock({
  variant = "short",
  eventMeta,
  onRetry,
  onSignOut,
}: {
  variant?: "very-short" | "short" | "detailed";
  eventMeta?: EventMeta;
  onRetry?: () => void;
  onSignOut?: () => void;
}) {
  const retry = onRetry ?? (() => window.location.reload());
  const signOut = onSignOut ?? (() => {});
  const relog = () => window.location.assign('/');

  if (variant === "very-short") {
    return (
      <div role="status" className="rounded-md bg-yellow-50 p-3 flex items-center justify-between gap-3">
        <div>
          <strong className="block">Action blocked</strong>
          <span className="text-sm text-muted-foreground">We blocked a suspicious request for your safety.</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={retry}>Retry</Button>
          <SupportButton eventMeta={eventMeta} />
        </div>
      </div>
    );
  }

  return (
    <Card role="alertdialog" aria-labelledby="secBlockTitle" className="shadow-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-red-600">
            <path fillRule="evenodd" d="M11.47 2.16a1 1 0 011.06 0l7 4.5A1 1 0 0120 8.5v5.8a6 6 0 01-4.2 5.7l-1.3.45a2 2 0 01-1.6 0l-1.3-.45A6 6 0 015 14.3V8.5a1 1 0 01-.53-.84l7-4.5zM12 8a1 1 0 00-.993.883L11 9v3a1 1 0 001.993.117L13 12V9a1 1 0 00-1-1zm0 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
          </svg>
        </div>
        <CardTitle id="secBlockTitle">{variant === "detailed" ? "We've blocked this request" : "Request blocked"}</CardTitle>
        <CardDescription>
          {variant === "detailed"
            ? "We stopped a request that looked unusual. Re-authenticate to continue or try again."
            : "We prevented a suspicious request. Sign in to continue or retry."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {variant === "detailed" && (
          <ul className="mb-3 list-disc pl-5 text-sm">
            <li>Retry the action</li>
            <li>Sign out and sign back in</li>
            <li>Disable VPN or proxy and try again</li>
          </ul>
        )}

        <div className="text-sm text-muted-foreground mb-2">Ref: {eventMeta?.event_id ?? "-"} · {eventMeta?.timestamp ?? "-"}</div>

        <div className="mb-2 text-sm">If this was you, please sign in again to continue. Otherwise sign out or contact support.</div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={relog} className="min-w-[96px]">Sign in</Button>
          <Button variant="outline" onClick={retry} className="min-w-[88px]">Retry</Button>
          <Button variant="ghost" onClick={signOut} className="min-w-[88px]">Sign out</Button>
          <SupportButton eventMeta={eventMeta} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [sampleMeta, setSampleMeta] = useState<EventMeta>({ event_id: "REF-12345" });

  useEffect(() => {
    setSampleMeta({ event_id: "REF-12345", timestamp: new Date().toISOString() });
  }, []);
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-10 bg-slate-50">
      <section className="w-full sm:max-w-md">
        <SecurityBlock variant="short" eventMeta={sampleMeta} />
      </section>
    </main>
  );
}