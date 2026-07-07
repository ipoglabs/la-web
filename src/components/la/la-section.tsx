import * as React from "react";
import { LaText } from "./la-text";

export default function LaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <LaText type="h2">{title}</LaText>
      {children}
    </section>
  );
}
