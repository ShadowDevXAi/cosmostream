"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2.5 select-none", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Shifted generic frames to alpha frosted circular pods with reactive neon scaling
        "peer aspect-square h-4 w-4 rounded-full border border-white/10 bg-white/[0.01] text-purple-400 shadow-md transition-all duration-200 cursor-pointer " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 " +
        "disabled:cursor-not-allowed disabled:opacity-25 " +
        "data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500/5 data-[state=checked]:shadow-[0_0_12px_rgba(168,85,247,0.25)] " +
        "active:scale-95 flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* Swapped heavy standard indicators with sharp core glowing micro nodes */}
        <Circle className="h-1.5 w-1.5 fill-current stroke-none drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
