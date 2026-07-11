"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      // Upgraded generic track to a sleek, dark alpha glass pipe with deep borders
      "relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.02] border border-white/5 shadow-inner select-none",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      // Infused the signature cosmic purple-to-pink plasma gradient stream with active neon pulse shadows
      className="h-full w-full flex-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 transition-all duration-500 ease-out will-change-transform transform-gpu shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-full"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
