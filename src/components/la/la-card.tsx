import * as React from "react";
import { cn } from "@/lib/utils";

export type LaCardProps = React.HTMLAttributes<HTMLDivElement>;

const LaCard = React.forwardRef<HTMLDivElement, LaCardProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("rounded-xl border-[1.5px] border-slate-300 bg-white", className)} {...props} />;
});

LaCard.displayName = "LaCard";

export { LaCard };