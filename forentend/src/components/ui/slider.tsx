"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center transform-gpu",
      className,
    )}
    {...props}
  >
    {/* Remapped traditional path to an ultra-subtle alpha glass channel with inner depths shadows */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/[0.02] border border-white/5 shadow-inner">
      {/* Infused signature cosmic purple-to-pink plasma stream with active halo glowing tracking */}
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
    </SliderPrimitive.Track>
    
    {/* Corrected raw string concatenation syntax safely by wrapping all variant parameters into standard cn array tools */}
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-4 w-4 rounded-lg border border-purple-500/40 bg-[#0c0d14] shadow-[0_0_8px_rgba(168,85,247,0.3)] transition-all duration-200 cursor-grab active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:border-purple-400",
        "active:scale-110 disabled:pointer-events-none disabled:opacity-20"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
