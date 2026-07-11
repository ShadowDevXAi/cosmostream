import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Infused modern letter spacing, custom mono transitions, and crisp hardware active scaling
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/40 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // High-fidelity space engine plasma glow vector layout
        default: 
          "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-950/20 text-shadow-sm",
        // Tactical deep red failover alert chip setup
        destructive: 
          "border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/10 shadow-lg shadow-red-950/5",
        // Translucent glassmorphic dark matter framing layout
        outline:
          "border border-white/10 bg-white/[0.01] text-neutral-200 hover:bg-white/5 hover:border-white/20 hover:text-white shadow-md",
        // Muted interface secondary tracking anchor blocks
        secondary: 
          "border border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white",
        // Invisible layout pads that smoothly morph into frosted matrix nodes
        ghost: 
          "text-muted-foreground/80 hover:bg-white/5 hover:text-white",
        // Interactive purple-pink connection stream pointer string
        link: 
          "text-purple-400 normal-case font-sans font-medium tracking-normal underline-offset-4 hover:text-pink-400 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-[11px] tracking-wide",
        lg: "h-12 rounded-2xl px-8 text-sm tracking-widest",
        icon: "h-11 w-11 rounded-xl bg-white/[0.01] border border-white/5 text-muted-foreground hover:text-white hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
