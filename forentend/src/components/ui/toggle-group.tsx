"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    // Encased item matrices into a sleek, dark frosted horizontal tracking capsule shell
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 p-1 select-none gap-1.5", 
      className
    )}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // Remapped item strings into custom crisp tracked alphanumeric monospace labels definitions
        "font-mono text-xs font-bold uppercase tracking-wider rounded-lg h-9 px-3.5 border border-transparent transition-all duration-200 cursor-pointer select-none " +
        "hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20 " +
        "disabled:pointer-events-none disabled:opacity-20 " +
        // Injected signature translucent neon purple gradient layouts when element activations trigger on
        "data-[state=on]:bg-gradient-to-br data-[state=on]:from-purple-600/15 data-[state=on]:to-indigo-600/5 data-[state=on]:text-purple-300 data-[state=on]:border-purple-500/20 data-[state=on]:shadow-[0_0_15px_rgba(168,85,247,0.1)] " +
        "active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
