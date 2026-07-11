"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    {/* Bound viewport layout wrappers to maintain persistent clean edge definitions */}
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner className="bg-transparent" />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      // Remapped traditional scrollbars into sleek, transparent floating tracking tracks
      "flex touch-none select-none transition-all duration-300 z-50 transform-gpu",
      orientation === "vertical" && "h-full w-2 border-l border-l-transparent p-[2px] hover:bg-white/[0.02]",
      orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent p-[2px] hover:bg-white/[0.02]",
      className,
    )}
    {...props}
  >
    {/* Upgraded standard gray block element into custom glowing cyberpunk core fluid anchor caps */}
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className="relative flex-1 rounded-full bg-white/10 transition-colors duration-300 hover:bg-purple-500/40 active:bg-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.15)]" 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
