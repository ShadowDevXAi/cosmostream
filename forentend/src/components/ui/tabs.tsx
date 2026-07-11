"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    // Expanded list header track to h-11 heights to seamlessly match inputs and selects modules grids
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 p-1 text-neutral-400 select-none",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    // Remapped text strings into custom crisp tracked alphanumeric monospace labels definitions
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 h-9 font-mono text-xs font-bold uppercase tracking-wider border border-transparent outline-none cursor-pointer transition-all duration-200 " +
      "hover:text-purple-400 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20 " +
      "disabled:pointer-events-none disabled:opacity-20 " +
      // Injected signature translucent neon purple gradient layouts when tabs activations trigger on
      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600/15 data-[state=active]:to-indigo-600/5 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/20 data-[state=active]:shadow-[0_0_15px_rgba(168,85,247,0.1)] " +
      "active:scale-95",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    // Infused hardware-accelerated micro vertical slides animations during active tab transformations loops
    className={cn(
      "mt-3 outline-none focus-visible:outline-none transform-gpu " +
      "data-[state=active]:animate-in data-[state=active]:fade-in-30 data-[state=active]:slide-in-from-bottom-2 duration-300",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
