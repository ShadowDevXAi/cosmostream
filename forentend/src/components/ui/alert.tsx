import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  // Enforcing hardware-accelerated padding alignments and container radii
  "relative w-full rounded-xl border p-4 text-sm backdrop-blur-md transition-all duration-300 [&>svg+div]:translate-y-[-1px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7 overflow-hidden select-none",
  {
    variants: {
      variant: {
        // Futuristic inline left linear edge accent vectors combined with alpha-masks
        default: 
          "bg-white/[0.01] border-white/5 text-neutral-200 [&>svg]:text-purple-400 shadow-xl after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-gradient-to-b after:from-purple-500 after:to-indigo-500",
        destructive:
          "border-red-500/10 bg-red-500/[0.02] text-red-400 [&>svg]:text-red-400 shadow-lg shadow-red-950/5 after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-red-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-mono text-xs font-black tracking-wider uppercase text-neutral-200", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("text-xs font-mono text-muted-foreground/70 leading-relaxed [&_p]:leading-relaxed", className)} 
    {...props} 
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
