"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Shifted borders to translucent glass matting and set up active purple glow matrices
      "peer h-4 w-4 shrink-0 rounded-md border border-white/10 bg-white/[0.01] shadow-md transition-all duration-200 cursor-pointer " +
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/40 " +
      "disabled:cursor-not-allowed disabled:opacity-25 " +
      "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-purple-600 data-[state=checked]:to-indigo-600 data-[state=checked]:border-transparent data-[state=checked]:text-white data-[state=checked]:shadow-[0_0_10px_rgba(168,85,247,0.2)] " +
      "active:scale-95 select-none flex items-center justify-center",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      {/* Increased stroke density to maintain extreme visibility inside dark grid modules */}
      <Check className="h-2.5 w-2.5 stroke-[3.5]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
