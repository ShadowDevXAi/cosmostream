"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Remapped traditional toggle track into a deep translucent cosmic channel
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-white/[0.01] shadow-inner transition-all duration-300 outline-none select-none " +
      // Intercepted active rings to emit signature glowing purple halos
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:ring-offset-0 " +
      "disabled:cursor-not-allowed disabled:opacity-20 " +
      // Injected high-fidelity neon plasma gradient stream on active track states
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-indigo-600 data-[state=checked]:border-purple-500/40 data-[state=checked]:shadow-[0_0_12px_rgba(168,85,247,0.3)]",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Transformed standard thumb round knob into a futuristic bright core capsule node with micro scaling
        "pointer-events-none block h-3.5 w-3.5 rounded-full bg-neutral-300 border border-white/20 shadow-md transition-all duration-300 ease-out " +
        "data-[state=checked]:translate-x-4 data-[state=checked]:bg-white data-[state=checked]:border-purple-300 data-[state=checked]:shadow-[0_0_8px_rgba(168,85,247,0.6)] " +
        "data-[state=unchecked]:translate-x-0.5 " +
        "peer-active:scale-90",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
