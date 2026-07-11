import * as React from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Remapped flat grey pulses into sleek translucent cyber dark space placeholders
        "animate-pulse rounded-xl bg-white/[0.03] border border-white/[0.02] shadow-[inset_0_0_12px_rgba(168,85,247,0.02)] select-none pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
