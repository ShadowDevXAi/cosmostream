"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      // Shifted backdrops to deep dark matter glass layers with balanced blur filters
      "fixed inset-0 z-50 bg-[#06070a]/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  // Remapped structural panels into frosted cyber dark core layers with purple shadow deep tracking
  "fixed z-50 gap-4 bg-[#0c0d14]/90 backdrop-blur-xl p-6 text-white shadow-2xl shadow-purple-950/30 transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out select-none outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-white/5 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t border-white/5 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-white/5 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l border-white/5 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {/* Absolute decorative accent tracking line mapping based on slide layouts direction fields */}
      {side === "right" && <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent pointer-events-none" />}
      {side === "left" && <div className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent pointer-events-none" />}
      {side === "top" && <div className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />}
      {side === "bottom" && <div className="absolute left-0 right-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />}

      {/* Upgraded standard looking close box into custom responsive digital close vector loop */}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-xl h-7 w-7 flex items-center justify-center border border-white/0 bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 hover:border-white/5 active:scale-90 transition-all duration-300 cursor-pointer focus:outline-none disabled:pointer-events-none">
        <X className="h-4 w-4 stroke-[2.5]" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left border-b border-white/[0.02] pb-4 mb-4", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2.5 gap-2 sm:gap-0 border-t border-white/[0.02] mt-4 pt-4 absolute bottom-6 left-6 right-6", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    // Formatted heading anchors into crisp uppercase monospace variables tracking weights
    className={cn("text-sm font-mono font-black tracking-wider uppercase text-neutral-200", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-xs font-mono text-muted-foreground/60 leading-relaxed", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
