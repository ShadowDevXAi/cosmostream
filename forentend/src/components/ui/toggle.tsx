"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  // Replaced heavy traditional button tracking blocks into sleek alpha matrices arrays
  "inline-flex items-center justify-center gap-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border border-transparent cursor-pointer transition-all duration-200 outline-none select-none " +
  "hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20 " +
  "disabled:pointer-events-none disabled:opacity-20 aria-disabled:pointer-events-none aria-disabled:opacity-20 " +
  // Injected signature translucent neon purple gradient layouts when element activations trigger on
  "data-[state=on]:bg-gradient-to-br data-[state=on]:from-purple-600/15 data-[state=on]:to-indigo-600/5 data-[state=on]:text-purple-300 data-[state=on]:border-purple-500/20 data-[state=on]:shadow-[0_0_15px_rgba(168,85,247,0.1)] " +
  "active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-neutral-400 data-[state=on]:[&_svg]:text-purple-400",
  {
    variants: {
      variant: {
        default: "bg-transparent text-neutral-300",
        outline:
          "border-white/10 bg-white/[0.01] text-neutral-300 hover:bg-white/5",
      },
      size: {
        // Aligned bounding box limits to stay clean across intense workspace tables grids
        default: "h-9 px-3.5 min-w-9",
        sm: "h-8 px-2.5 min-w-8 text-[11px]",
        lg: "h-11 px-4 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    ...props
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
