import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // Shifted typography to tight tracking mono chips with non-selectable padding properties
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none select-none",
  {
    variants: {
      variant: {
        // Futuristic translucent neon capsules with custom glow matrices
        default:
          "border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.08)]",
        secondary:
          "border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10",
        destructive:
          "border-red-500/20 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.05)]",
        outline: 
          "border-white/10 bg-transparent text-neutral-400 hover:text-white hover:border-white/20",
        // Added industrial success wrapper node for active variables
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
